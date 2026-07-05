// Центральная WebGL-сцена: светящийся hero-бассейн на глубоком чёрном.
// Реалистичная чаша — GLB (Higgsfield/Meshy), фолбэк — процедурная геометрия.
// Все динамические элементы (вода, LED, котлован, обвязка, ППУ) строятся
// по ИЗМЕРЕННОМУ габариту чаши (bbox), а не по константам — GLB и фолбэк
// получают одинаково аккуратную посадку.
// setProgress(0..1) — 8 фаз постройки; setHeroBlend(1..0) — переход hero → «замер».
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { createWaterMaterial } from './water.js';

const _map = (p, a, b) => THREE.MathUtils.clamp((p - a) / (b - a), 0, 1);
const AQUA = new THREE.Color('#35c8ea');

// целевой габарит чаши в юнитах сцены (≈ CLASSIC 8,5×3,7)
const POOL_W = 6.4;
const POOL_D = 2.9;
const POOL_H = 1.35;
const TOP_Y = 0.12; // уровень борта

export class PoolScene {
  constructor(canvas, { glbUrl = '', reduced = false } = {}) {
    this.canvas = canvas;
    this.reduced = reduced;
    this.progress = 0;
    this.heroBlend = 1;
    this.paused = false;
    this.disposed = false;
    this.clock = new THREE.Clock();
    this.orbitPhase = 0;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(0x04070a, 1);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    this.scene = new THREE.Scene();
    this.scene.fog = null; // без дымки: перекрут топит чёрный в муть

    this.camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);

    // env — приглушённый: достаточно материалам, не серит фон
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 0.22;
    pmrem.dispose();

    const key = new THREE.DirectionalLight(0xbfe6f2, 1.1);
    key.position.set(4, 7, 3);
    this.scene.add(key);
    const rimL = new THREE.DirectionalLight(0x35c8ea, 0.5);
    rimL.position.set(-5, 3, -4);
    this.scene.add(rimL);
    this.scene.add(new THREE.AmbientLight(0x0e2233, 0.7));

    this.root = new THREE.Group();
    this.scene.add(this.root);

    // габарит по умолчанию (процедурный); GLB заменит измеренным
    this.dims = { w: POOL_W, d: POOL_D, h: POOL_H, topY: TOP_Y, inset: 0.9 };

    this._buildSurvey();
    this._buildDust();

    this.shell = new THREE.Group();
    this.root.add(this.shell);
    this.dynamic = new THREE.Group(); // вода/LED/котлован/обвязка/ППУ — по dims
    this.root.add(this.dynamic);

    this._initShell(glbUrl);

    // bloom: сдержанный — планка «чистый чёрный», не засветка
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.55, 0.32, 0.82);
    this.composer.addPass(this.bloom);

    this.resize();
    window.addEventListener('resize', () => this.resize());
    document.addEventListener('visibilitychange', () => {
      this._visible = !document.hidden;
    });
    this._visible = true;

    if (this.reduced) {
      this._renderOnce();
    } else {
      this.renderer.setAnimationLoop(() => this._tick());
    }
  }

  /* ---------- чаша: GLB или процедурная ---------- */

  _initShell(glbUrl) {
    this.built = false;

    const finish = () => {
      this._buildDynamic();
      this.built = true;
      this._applyState();
      if (this.reduced) this._renderOnce();
    };

    if (!glbUrl) {
      this._buildProceduralShell();
      finish();
      return;
    }

    let settled = false;
    new GLTFLoader().load(
      glbUrl,
      (gltf) => {
        if (this.disposed) return;
        this._mountGlb(gltf.scene);
        settled = true;
        finish(); // пересоберёт динамику по измеренному габариту
      },
      undefined,
      () => {
        if (settled || this.disposed) return;
        settled = true;
        this._buildProceduralShell();
        finish();
      }
    );
    // страховка: GLB дольше 6с — показываем процедурную; GLB заменит по готовности
    setTimeout(() => {
      if (!settled && !this.disposed) {
        this._buildProceduralShell();
        finish();
      }
    }, 6000);
  }

  _mountGlb(model) {
    // ориентация: длинная сторона — вдоль X
    let bb = new THREE.Box3().setFromObject(model);
    let size = bb.getSize(new THREE.Vector3());
    if (size.z > size.x) {
      model.rotation.y = Math.PI / 2;
      bb.setFromObject(model);
      size = bb.getSize(new THREE.Vector3());
    }
    const scale = POOL_W / size.x;
    model.scale.setScalar(scale);
    bb.setFromObject(model);
    size = bb.getSize(new THREE.Vector3());
    const center = bb.getCenter(new THREE.Vector3());
    model.position.x -= center.x;
    model.position.z -= center.z;
    model.position.y -= bb.max.y - TOP_Y; // борт на уровне TOP_Y

    model.traverse((o) => {
      if (o.isMesh && o.material) {
        o.material.envMapIntensity = 0.6;
        if ('roughness' in o.material) {
          o.material.roughness = Math.min(o.material.roughness ?? 0.4, 0.35);
        }
      }
    });

    // измеренный габарит — источник правды для воды/LED/котлована
    this.dims = {
      w: size.x,
      d: size.z,
      h: Math.min(Math.max(size.y, 0.8), 2.2), // защита от мусорной высоты bbox
      topY: TOP_Y,
      inset: 0.8, // у GLB широкий фланец — вода глубже внутрь
    };

    this.shell.clear();
    this.shell.add(model);
    this.usingGlb = true;
  }

  _roundedRectShape(w, d, r) {
    const s = new THREE.Shape();
    const x = -w / 2;
    const y = -d / 2;
    s.moveTo(x + r, y);
    s.lineTo(x + w - r, y);
    s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + d - r);
    s.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
    s.lineTo(x + r, y + d);
    s.quadraticCurveTo(x, y + d, x, y + d - r);
    s.lineTo(x, y + r);
    s.quadraticCurveTo(x, y, x + r, y);
    return s;
  }

  _buildProceduralShell() {
    if (this.shell.children.length) return;
    const gelcoat = new THREE.MeshPhysicalMaterial({
      color: 0x0e5d8c,
      roughness: 0.18,
      metalness: 0,
      clearcoat: 0.7,
      clearcoatRoughness: 0.2,
      envMapIntensity: 0.7,
    });

    const wallShape = this._roundedRectShape(POOL_W, POOL_D, 0.5);
    wallShape.holes.push(this._roundedRectShape(POOL_W - 0.36, POOL_D - 0.36, 0.4));
    const walls = new THREE.Mesh(
      new THREE.ExtrudeGeometry(wallShape, { depth: POOL_H, bevelEnabled: false }),
      gelcoat
    );
    walls.rotation.x = -Math.PI / 2;
    walls.position.y = -POOL_H + TOP_Y;
    this.shell.add(walls);

    const floor = new THREE.Mesh(
      new THREE.ShapeGeometry(this._roundedRectShape(POOL_W - 0.3, POOL_D - 0.3, 0.42)),
      gelcoat
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -POOL_H + TOP_Y + 0.01;
    this.shell.add(floor);

    for (let i = 0; i < 3; i++) {
      const sw = POOL_D - 0.7 - i * 0.5;
      const step = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.3, sw), gelcoat);
      step.position.set(POOL_W / 2 - 0.42 - i * 0.4, -0.03 - i * 0.32, 0);
      this.shell.add(step);
    }

    const copingShape = this._roundedRectShape(POOL_W + 0.5, POOL_D + 0.5, 0.56);
    copingShape.holes.push(this._roundedRectShape(POOL_W - 0.2, POOL_D - 0.2, 0.44));
    this.copingMat = new THREE.MeshStandardMaterial({
      color: 0xcdc9be,
      roughness: 0.5,
      envMapIntensity: 0.58,
      emissive: 0x0d3742,
      emissiveIntensity: 0,
    });
    const coping = new THREE.Mesh(
      new THREE.ExtrudeGeometry(copingShape, { depth: 0.09, bevelEnabled: false }),
      this.copingMat
    );
    coping.rotation.x = -Math.PI / 2;
    coping.position.y = TOP_Y;
    this.shell.add(coping);
  }

  /* ---------- статические элементы ---------- */

  _buildSurvey() {
    // сетка разметки + радар-развёртка + пульс-маркер (STAGE_01)
    const g = new THREE.Group();
    const gridMat = new THREE.LineBasicMaterial({
      color: AQUA,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const pts = [];
    const S = 5.2;
    for (let i = -4; i <= 4; i++) {
      pts.push(new THREE.Vector3(-S, 0, (i * S) / 4), new THREE.Vector3(S, 0, (i * S) / 4));
      pts.push(new THREE.Vector3((i * S) / 4, 0, -S), new THREE.Vector3((i * S) / 4, 0, S));
    }
    g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), gridMat));

    const sweepMat = new THREE.MeshBasicMaterial({
      color: AQUA,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.sweep = new THREE.Mesh(new THREE.CircleGeometry(S * 0.92, 48, 0, Math.PI / 5), sweepMat);
    this.sweep.rotation.x = -Math.PI / 2;
    this.sweep.position.y = 0.01;
    g.add(this.sweep);

    const ringMat = sweepMat.clone();
    this.pulse = new THREE.Mesh(new THREE.RingGeometry(0.98, 1, 64), ringMat);
    this.pulse.rotation.x = -Math.PI / 2;
    this.pulse.position.y = 0.02;
    g.add(this.pulse);

    this.survey = g;
    this.surveyMats = [gridMat, sweepMat, ringMat];
    this.root.add(g);
  }

  _buildDust() {
    const count = this.reduced ? 0 : 220;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = Math.random() * 6 - 1.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.dustMat = new THREE.PointsMaterial({
      color: 0x35c8ea,
      size: 0.03,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.dust = new THREE.Points(geo, this.dustMat);
    this.root.add(this.dust);
  }

  /* ---------- динамика по измеренному габариту ---------- */

  _buildDynamic() {
    const { w, d, h, topY, inset } = this.dims;

    // пересборка (GLB мог прийти после процедурного фолбэка)
    this.dynamic.traverse((o) => {
      if (o.isMesh || o.isLineSegments || o.isSprite) {
        o.geometry?.dispose?.();
      }
    });
    this.dynamic.clear();

    /* котлован: светящийся каркас + тёмное дно */
    const pw = w + 0.9;
    const pd = d + 0.9;
    const ph = h + 0.3;
    this.pitEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(pw, ph, pd)),
      new THREE.LineBasicMaterial({
        color: 0x2a97b5,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      })
    );
    this.pitEdges.position.y = topY - ph / 2 - 0.02;
    this.dynamic.add(this.pitEdges);

    this.pitFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(pw, pd),
      new THREE.MeshStandardMaterial({
        color: 0x0a1620,
        roughness: 0.95,
        transparent: true,
        opacity: 0,
      })
    );
    this.pitFloor.rotation.x = -Math.PI / 2;
    this.pitFloor.position.y = topY - ph - 0.02;
    this.dynamic.add(this.pitFloor);

    /* обвязка: насос+фильтр+трубы у длинного борта */
    const metal = new THREE.MeshStandardMaterial({
      color: 0x9fb3c4,
      roughness: 0.35,
      metalness: 0.7,
      transparent: true,
      opacity: 0,
    });
    const equip = new THREE.Group();
    const pump = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.42, 0.45), metal);
    pump.position.set(-w / 2 - 0.95, topY - h * 0.55, -d * 0.16);
    equip.add(pump);
    const filterMat = metal.clone();
    const filter = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.72, 20), filterMat);
    filter.position.set(-w / 2 - 0.95, topY - h * 0.45, d * 0.18);
    equip.add(filter);
    const pipeMat = metal.clone();
    for (const z of [-d * 0.16, d * 0.18]) {
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.95, 10), pipeMat);
      pipe.rotation.z = Math.PI / 2;
      pipe.position.set(-w / 2 - 0.45, topY - h * 0.55, z);
      equip.add(pipe);
    }
    const nodeMat = new THREE.MeshBasicMaterial({ color: AQUA, transparent: true, opacity: 0 });
    for (let i = 0; i < 3; i++) {
      const node = new THREE.Mesh(new THREE.SphereGeometry(0.08, 14, 14), nodeMat);
      node.position.set(-w / 2 + 0.06, topY - h * 0.6, -d * 0.3 + i * d * 0.3);
      equip.add(node);
    }
    this.equipment = equip;
    this.equipMats = [metal, filterMat, pipeMat, nodeMat];
    this.dynamic.add(equip);

    /* ППУ-утепление: тёплая оболочка вокруг чаши */
    const foamShape = this._roundedRectShape(w + 0.26, d + 0.26, Math.min(d * 0.2, 0.54));
    foamShape.holes.push(this._roundedRectShape(w * 0.99, d * 0.99, Math.min(d * 0.17, 0.46)));
    this.foamMat = new THREE.MeshBasicMaterial({
      color: 0xf2e9c9,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.foam = new THREE.Mesh(
      new THREE.ExtrudeGeometry(foamShape, { depth: h * 0.92, bevelEnabled: false }),
      this.foamMat
    );
    this.foam.rotation.x = -Math.PI / 2;
    this.foam.position.y = topY - h * 0.94;
    this.dynamic.add(this.foam);

    /* вода: скруглённый контур внутри чаши (не прямоугольник — без углов сквозь стенки) */
    const ww = w * inset;
    const wd = d * inset;
    this.waterMat = createWaterMaterial();
    const waterShape = this._roundedRectShape(ww, wd, Math.min(wd * 0.24, 0.6));
    const waterGeo = new THREE.ShapeGeometry(waterShape, 24);
    // UV у ShapeGeometry — сырые координаты; шейдер ждёт 0..1
    {
      const posAttr = waterGeo.attributes.position;
      const uvAttr = waterGeo.attributes.uv;
      for (let i = 0; i < posAttr.count; i++) {
        uvAttr.setXY(i, posAttr.getX(i) / ww + 0.5, posAttr.getY(i) / wd + 0.5);
      }
      uvAttr.needsUpdate = true;
    }
    this.water = new THREE.Mesh(waterGeo, this.waterMat);
    this.water.rotation.x = -Math.PI / 2;
    this.water.position.y = topY - h;
    this.dynamic.add(this.water);

    /* LED-контур на границе воды + glow-гало */
    const path = this._rimPath(ww * 0.985, wd * 0.985, Math.min(wd * 0.22, 0.55));
    this.ledMat = new THREE.MeshBasicMaterial({
      color: 0x6fe4ff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });
    this.led = new THREE.Mesh(new THREE.TubeGeometry(path, 128, 0.045, 8, true), this.ledMat);
    this.dynamic.add(this.led);

    if (!this.glowTex) {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 64;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(83,214,240,0.85)');
      grad.addColorStop(0.4, 'rgba(53,200,234,0.28)');
      grad.addColorStop(1, 'rgba(53,200,234,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
      this.glowTex = new THREE.CanvasTexture(canvas);
    }
    this.glowMat = new THREE.SpriteMaterial({
      map: this.glowTex,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });
    this.glowSprites = [];
    for (const pt of path.getSpacedPoints(24)) {
      const s = new THREE.Sprite(this.glowMat);
      s.position.copy(pt);
      s.scale.setScalar(0.8);
      this.glowSprites.push(s);
      this.dynamic.add(s);
    }
  }

  _rimPath(w, d, r) {
    const path = new THREE.CurvePath();
    const seg = (x1, z1, x2, z2) =>
      new THREE.LineCurve3(new THREE.Vector3(x1, 0, z1), new THREE.Vector3(x2, 0, z2));
    const arc = (cx, cz, a0, a1) => {
      const pts = [];
      for (let i = 0; i <= 8; i++) {
        const a = a0 + ((a1 - a0) * i) / 8;
        pts.push(new THREE.Vector3(cx + r * Math.cos(a), 0, cz + r * Math.sin(a)));
      }
      return new THREE.CatmullRomCurve3(pts);
    };
    const hw = w / 2 - r;
    const hd = d / 2 - r;
    path.add(seg(-hw, -d / 2, hw, -d / 2));
    path.add(arc(hw, -hd, -Math.PI / 2, 0));
    path.add(seg(w / 2, -hd, w / 2, hd));
    path.add(arc(hw, hd, 0, Math.PI / 2));
    path.add(seg(hw, d / 2, -hw, d / 2));
    path.add(arc(-hw, hd, Math.PI / 2, Math.PI));
    path.add(seg(-w / 2, hd, -w / 2, -hd));
    path.add(arc(-hw, -hd, Math.PI, Math.PI * 1.5));
    return path;
  }

  /* ---------- состояние по прогрессу ---------- */

  setProgress(p) {
    this.progress = THREE.MathUtils.clamp(p, 0, 1);
    if (this.reduced) {
      this._applyState();
      this._renderOnce();
    }
  }

  setHeroBlend(b) {
    this.heroBlend = THREE.MathUtils.clamp(b, 0, 1);
    if (this.reduced) {
      this._applyState();
      this._renderOnce();
    }
  }

  setPaused(v) {
    this.paused = v;
  }

  _applyState() {
    if (!this.built) return;
    const p = this.progress;
    const hb = this.heroBlend; // 1 = beauty-герой, 0 = таймлайн постройки
    const { h, topY } = this.dims;

    // фазовые параметры постройки
    const gridT = _map(p, 0, 0.045) * (1 - _map(p, 0.11, 0.16));
    const pitT = _map(p, 0.13, 0.21) * (1 - _map(p, 0.5, 0.6));
    const shellDrop = _map(p, 0.255, 0.36);
    const shellVis = p > 0.25 ? 1 : 0;
    const equipT = _map(p, 0.38, 0.45);
    const orbFade = 1 - _map(p, 0.56, 0.615); // обвес гаснет рано: чистые фазы воды/LED
    const foamT = _map(p, 0.5, 0.575) * (1 - _map(p, 0.6, 0.66));
    const waterT = _map(p, 0.63, 0.745);
    const ledT = _map(p, 0.765, 0.845);
    const readyT = _map(p, 0.875, 1);

    // бленд с beauty-состоянием героя (всё построено, вода+LED включены)
    const B = (build, hero) => build * (1 - hb) + hero * hb;

    const grid = B(gridT, 0);
    const pit = B(pitT, 0);
    // чаша опускается краном; без прозрачности — чистый reveal движением
    const shellY = B((1 - THREE.MathUtils.smoothstep(shellDrop, 0, 1)) * 4.2, 0);
    const shellOn = B(shellVis, 1) > 0.5;
    const equip = B(equipT * orbFade, 0);
    const foam = B(foamT, 0);
    const water = B(waterT, 1);
    const led = B(Math.max(ledT, readyT * 0.9), 1);
    const glowK = B(Math.max(ledT * 0.65, readyT * 0.75), 0.7);

    this.surveyMats[0].opacity = grid * 0.5;
    this.surveyMats[1].opacity = grid * 0.28;
    this.surveyMats[2].opacity = grid * 0.6;
    this.survey.visible = grid > 0.01;

    this.pitEdges.material.opacity = pit * 0.55;
    this.pitFloor.material.opacity = pit * 0.9;
    this.pitEdges.visible = this.pitFloor.visible = pit > 0.01;

    this.shell.position.y = shellY;
    this.shell.visible = shellOn;

    this.equipMats.forEach((m) => (m.opacity = equip * 0.95));
    this.equipment.visible = equip > 0.01;

    this.foamMat.opacity = foam * 0.16;
    this.foam.visible = foam > 0.01;

    // вода поднимается внутри чаши: от дна до кромки чуть ниже борта
    const waterLevel = topY - h * 0.92 + water * h * 0.8;
    this.water.position.y = waterLevel;
    this.waterMat.uniforms.uOpacity.value = water > 0.01 ? 0.55 + water * 0.4 : 0;
    this.waterMat.uniforms.uLed.value = led * 0.55;
    this.water.visible = water > 0.01;

    this.ledMat.opacity = led;
    this.led.visible = led > 0.01;
    this.led.position.y = waterLevel + 0.05;
    this.glowMat.opacity = glowK * 0.8;
    for (const s of this.glowSprites) s.position.y = waterLevel + 0.05;

    if (this.copingMat) this.copingMat.emissiveIntensity = led * 0.35;
    this.dustMat.opacity = 0.12 + B(readyT, 0.8) * 0.3;
    // в hero сцена — приглушённый фон за контентом (конверсионный первый экран)
    this.bloom.strength = (0.4 + led * 0.35 + B(readyT, 0.5) * 0.15) * (1 - hb * 0.35);
    this.renderer.toneMappingExposure = 1.05 - hb * 0.3;

    // hero: чаша ниже и правее, отступает вглубь; мобайл — вниз за контент
    const wide = this.camera.aspect > 1;
    this.root.position.x = wide ? hb * 2.0 : 0;
    this.root.position.y = wide ? -hb * 0.55 : -hb * 3.3;

    // камера: кинематографичный дрейф; на READY — отъезд, чаша ниже текста
    const driftA = B(-0.42 + p * 0.85, 0);
    const azimuth = driftA + this.orbitPhase * B(readyT, 1);
    const polar = 0.98 - B(readyT, 0.9) * 0.08;
    const dist = 10.6 + readyT * (1 - hb) * 1.5 + hb * 2.4;
    const lookY = -0.35 + readyT * (1 - hb) * 1.15;
    this.camera.position.set(
      Math.sin(azimuth) * Math.sin(polar) * dist,
      Math.cos(polar) * dist,
      Math.cos(azimuth) * Math.sin(polar) * dist
    );
    this.camera.lookAt(0, lookY, 0);
  }

  /* ---------- цикл ---------- */

  _tick() {
    if (this.paused || !this._visible || this.disposed) return;
    const t = this.clock.getElapsedTime();

    this.orbitPhase = Math.sin(t * 0.11) * 0.28;
    if (this.waterMat) this.waterMat.uniforms.uTime.value = t;

    if (this.survey?.visible) {
      this.sweep.rotation.z = t * 0.9;
      const k = (t % 2.2) / 2.2;
      this.pulse.scale.setScalar(0.4 + k * 3.4);
      this.surveyMats[2].opacity = (1 - k) * 0.6 * (this.surveyMats[0].opacity / 0.5 || 0);
    }
    if (this.dust) this.dust.rotation.y = t * 0.02;

    this._applyState();
    this.composer.render();
  }

  _renderOnce() {
    if (this.disposed) return;
    this.composer.render();
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
    this.composer.setSize(w, h);
    if (this.reduced) this._renderOnce();
  }

  dispose() {
    this.disposed = true;
    this.renderer.setAnimationLoop(null);
    this.renderer.dispose();
  }
}
