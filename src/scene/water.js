// Шейдерная вода: Fresnel, градиент глубины, дешёвая каустика, LED-подсветка кромки.
import * as THREE from 'three';

export function createWaterMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uWave: { value: 1 }, // амплитуда волн (0 в reduced-motion)
      uLed: { value: 0 }, // интенсивность LED-кромки 0..1
      uOpacity: { value: 0 },
      uDeep: { value: new THREE.Color('#06263f') },
      uShallow: { value: new THREE.Color('#1897c0') },
      uLedColor: { value: new THREE.Color('#35c8ea') },
    },
    vertexShader: /* glsl */ `
      uniform float uTime;
      uniform float uWave;
      varying vec2 vUv;
      varying vec3 vWorldPos;
      varying vec3 vNormal;
      void main() {
        vUv = uv;
        vec3 p = position;
        float w = sin(p.x * 2.4 + uTime * 1.1) * 0.018
                + cos(p.y * 3.1 - uTime * 0.9) * 0.014;
        p.z += w * uWave;
        vec4 wp = modelMatrix * vec4(p, 1.0);
        vWorldPos = wp.xyz;
        // нормаль слегка возмущаем той же волной для бликов
        vNormal = normalize(normalMatrix * normalize(vec3(-w * 2.0, -w * 1.4, 1.0)));
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform float uLed;
      uniform float uOpacity;
      uniform vec3 uDeep;
      uniform vec3 uShallow;
      uniform vec3 uLedColor;
      varying vec2 vUv;
      varying vec3 vWorldPos;
      varying vec3 vNormal;

      // дешёвая «каустика»: интерференция синусов
      float caustic(vec2 p, float t) {
        float a = sin(p.x * 9.0 + t * 1.6) * sin(p.y * 8.0 - t * 1.2);
        float b = sin((p.x + p.y) * 7.0 - t * 0.8);
        float c = sin(length(p - 0.5) * 16.0 - t * 1.9);
        return pow(max(0.0, a * 0.5 + b * 0.3 + c * 0.4), 2.4);
      }

      void main() {
        vec3 viewDir = normalize(cameraPosition - vWorldPos);
        float fresnel = pow(1.0 - max(0.0, dot(viewDir, vNormal)), 2.6);

        // глубина: к центру темнее, у бортов и ступеней светлее
        float edge = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
        float depthF = smoothstep(0.0, 0.32, edge);
        vec3 col = mix(uShallow, uDeep, depthF * 0.85 + 0.1);

        col += vec3(0.35, 0.75, 0.85) * caustic(vUv, uTime) * 0.09;
        col += fresnel * vec3(0.30, 0.56, 0.66) * 0.28;

        // LED-кромка по периметру ватерлинии
        float rim = 1.0 - smoothstep(0.0, 0.085, edge);
        col += uLedColor * rim * uLed * 1.6;

        gl_FragColor = vec4(col, uOpacity * (0.86 + fresnel * 0.14));
      }
    `,
  });
}
