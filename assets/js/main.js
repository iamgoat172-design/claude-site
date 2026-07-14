(function(){
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js-ready");

  /* ============================================================
     STAGE ASSERT — verify pricing math before anything renders
     ============================================================ */
  (function assertPricing(){
    var stages = [3320012, 2006716, 1211860, 929260, 2914518];
    var rawSum = stages.reduce(function(a,b){ return a+b; }, 0);
    var discount = 160728;
    var finalPrice = rawSum - discount;
    var expected = 10221638;
    if (finalPrice !== expected) {
      console.error("[Дом за 45] ASSERT FAILED: stages sum minus discount =", finalPrice, "expected", expected);
    } else {
      console.log("[Дом за 45] Pricing assert OK:", rawSum, "-", discount, "=", finalPrice);
    }
    window.__DOM45_PRICE__ = expected;
  })();

  /* ============================================================
     LENIS SMOOTH SCROLL + GSAP ScrollTrigger
     ============================================================ */
  var lenis = null;
  if (!reduceMotion && window.Lenis) {
    lenis = new Lenis({
      duration: 1.1,
      easing: function(t){ return 1 - Math.pow(1 - t, 3); },
      smoothWheel: true,
    });
    function raf(time){
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (window.gsap && window.ScrollTrigger) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function(time){ lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* Smooth scroll for in-page anchor links (data-scroll + nav links) */
  function scrollToTarget(hash){
    var target = document.querySelector(hash);
    if (!target) return;
    var headerH = document.querySelector(".site-header") ? document.querySelector(".site-header").offsetHeight : 0;
    if (lenis) {
      lenis.scrollTo(target, { offset: -headerH + 8 });
    } else {
      var y = target.getBoundingClientRect().top + window.pageYOffset - headerH - 8;
      window.scrollTo({ top: y, behavior: reduceMotion ? "auto" : "smooth" });
    }
  }
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    var hash = a.getAttribute("href");
    if (!hash || hash === "#") return;
    a.addEventListener("click", function(e){
      var target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      scrollToTarget(hash);
      closeMobileMenu();
    });
  });
  document.querySelectorAll(".scroll-cue").forEach(function(btn){
    btn.addEventListener("click", function(){
      scrollToTarget(btn.getAttribute("data-scroll-target"));
    });
  });

  /* ============================================================
     REVEAL ANIMATIONS (GSAP ScrollTrigger, per-section variety)
     ============================================================ */
  function initReveals(){
    var items = document.querySelectorAll("[data-reveal]");
    if (reduceMotion || !window.gsap) {
      items.forEach(function(el){ el.style.opacity = 1; });
      return;
    }
    if (!window.ScrollTrigger) {
      items.forEach(function(el){ el.style.opacity = 1; });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    var easings = ["power2.out", "power3.out", "expo.out"];
    var sections = document.querySelectorAll(".section, .hero, .trust-strip");
    var globalIndex = 0;

    items.forEach(function(el){
      var type = el.getAttribute("data-reveal");
      var delay = parseInt(el.getAttribute("data-delay") || "0", 10) / 1000;
      var easing = easings[globalIndex % easings.length];
      globalIndex++;

      var fromVars = { opacity: 0 };
      if (type === "up") { fromVars.y = 56; }
      else if (type === "down") { fromVars.y = -56; }
      else if (type === "left") { fromVars.x = -64; }
      else if (type === "right") { fromVars.x = 64; }
      else if (type === "scale") { fromVars.scale = 0.94; fromVars.y = 20; }

      gsap.fromTo(el, fromVars, {
        opacity: 1, y: 0, x: 0, scale: 1,
        duration: 0.9,
        delay: delay,
        ease: easing,
        immediateRender: false,
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        }
      });
    });
  }

  /* ============================================================
     HERO SEASONAL CROSSFADE + KEN BURNS + PARALLAX
     ============================================================ */
  function initHero(){
    var slides = document.querySelectorAll(".hero-slide");
    if (!slides.length) return;
    var idx = 0;

    if (!reduceMotion) {
      setInterval(function(){
        slides[idx].classList.remove("is-active");
        idx = (idx + 1) % slides.length;
        slides[idx].classList.add("is-active");
      }, 6000);

      if (window.gsap) {
        gsap.to(slides, {
          scale: 1.06,
          duration: 18,
          ease: "none",
          repeat: -1,
          yoyo: false,
        });

        var heroContent = document.querySelector(".hero-content");
        if (heroContent && window.ScrollTrigger) {
          gsap.to(heroContent, {
            y: 90,
            opacity: 0.4,
            ease: "none",
            scrollTrigger: {
              trigger: ".hero",
              start: "top top",
              end: "bottom top",
              scrub: true,
            }
          });
        }
      }
    }
  }

  /* ============================================================
     PRICE COUNT-UP
     ============================================================ */
  function formatNumber(n){
    return Math.round(n).toLocaleString("ru-RU");
  }
  function initPriceCounter(){
    var el = document.getElementById("price-counter");
    if (!el) return;
    var target = parseInt(el.getAttribute("data-target"), 10);

    if (reduceMotion || !window.gsap) {
      el.textContent = formatNumber(target);
      return;
    }

    var counterObj = { val: 0 };
    var played = false;

    function play(){
      if (played) return;
      played = true;
      gsap.to(counterObj, {
        val: target,
        duration: 2.2,
        ease: "power2.out",
        onUpdate: function(){ el.textContent = formatNumber(counterObj.val); }
      });
    }

    if (window.ScrollTrigger) {
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        onEnter: play,
      });
    } else {
      play();
    }
  }

  /* ============================================================
     METRICS COUNT-UP
     ============================================================ */
  function initMetrics(){
    var els = document.querySelectorAll(".metric-count");
    if (!els.length) return;
    els.forEach(function(el){
      var target = parseInt(el.getAttribute("data-count"), 10);
      if (isNaN(target)) return;

      if (reduceMotion || !window.gsap || !window.ScrollTrigger) {
        el.textContent = target;
        return;
      }
      var obj = { val: 0 };
      var played = false;
      function play(){
        if (played) return;
        played = true;
        gsap.to(obj, {
          val: target,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: function(){ el.textContent = Math.round(obj.val); }
        });
      }
      ScrollTrigger.create({ trigger: el, start: "top 90%", onEnter: play });
    });
  }

  /* ============================================================
     BUILD-UP BAR — left-to-right fill on scroll (clip-path wipe)
     ============================================================ */
  function initBuildBar(){
    var track = document.querySelector(".build-track");
    if (!track) return;
    // Fallback: fully visible when motion is off or libs are missing
    if (reduceMotion || !window.gsap || !window.ScrollTrigger) return;

    gsap.fromTo(track,
      { clipPath: "inset(0 100% 0 0)" },
      {
        clipPath: "inset(0 0% 0 0)",
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: { trigger: track, start: "top 82%" }
      }
    );
  }

  /* ============================================================
     MORTGAGE CALCULATOR
     ============================================================ */
  function initCalculator(){
    var downSlider = document.getElementById("downpayment");
    var termSlider = document.getElementById("term");
    var downValueEl = document.getElementById("downpayment-value");
    var termValueEl = document.getElementById("term-value");
    var monthlyEl = document.getElementById("monthly-payment");
    var subEl = document.getElementById("calc-sub");
    if (!downSlider || !termSlider) return;

    var PRICE = window.__DOM45_PRICE__ || 10221638;
    var RATE = 0.06; // 6% годовых, семейная ипотека — ориентир

    var displayed = { val: 0 };

    function compute(){
      var downPct = parseInt(downSlider.value, 10);
      var years = parseInt(termSlider.value, 10);
      var downSum = Math.round(PRICE * downPct / 100);
      var loan = PRICE - downSum;
      var months = years * 12;
      var r = RATE / 12;

      var payment;
      if (r === 0) {
        payment = loan / months;
      } else {
        var pow = Math.pow(1 + r, months);
        payment = loan * r * pow / (pow - 1);
      }

      downValueEl.textContent = downPct + "% · " + formatNumber(downSum) + " ₽";
      termValueEl.textContent = years + (years === 1 ? " год" : (years < 5 ? " года" : " лет"));
      subEl.textContent = "Ставка " + (RATE*100).toFixed(0) + "% годовых · сумма кредита " + formatNumber(loan) + " ₽";

      animateMonthly(payment);
    }

    function animateMonthly(target){
      if (reduceMotion || !window.gsap) {
        monthlyEl.textContent = formatNumber(target);
        displayed.val = target;
        return;
      }
      gsap.to(displayed, {
        val: target,
        duration: 0.5,
        ease: "power2.out",
        onUpdate: function(){ monthlyEl.textContent = formatNumber(displayed.val); }
      });
    }

    downSlider.addEventListener("input", compute);
    termSlider.addEventListener("input", compute);
    compute();
  }

  /* ============================================================
     SEASON SWITCHER (three seasons showcase)
     ============================================================ */
  function initSeasonSwitcher(){
    var tabs = document.querySelectorAll(".season-tab");
    var photos = document.querySelectorAll(".season-photo");
    if (!tabs.length) return;
    tabs.forEach(function(tab){
      tab.addEventListener("click", function(){
        var season = tab.getAttribute("data-season-tab");
        tabs.forEach(function(t){ t.classList.remove("is-active"); t.setAttribute("aria-selected","false"); });
        tab.classList.add("is-active");
        tab.setAttribute("aria-selected","true");
        photos.forEach(function(p){
          p.classList.toggle("is-active", p.getAttribute("data-season-img") === season);
        });
      });
    });
  }

  /* ============================================================
     TIMELINE SCROLL PROGRESS
     ============================================================ */
  function initTimelineProgress(){
    var track = document.getElementById("timeline-track");
    var progress = document.getElementById("timeline-progress");
    if (!track || !progress) return;

    if (reduceMotion || !window.gsap || !window.ScrollTrigger) {
      progress.style.width = "100%";
      return;
    }

    gsap.to(progress, {
      width: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: track,
        start: "top 70%",
        end: "bottom 60%",
        scrub: 0.5,
      }
    });
  }

  /* ============================================================
     FAQ ACCORDION
     ============================================================ */
  function initFaq(){
    var items = document.querySelectorAll(".faq-item");
    items.forEach(function(item){
      var btn = item.querySelector(".faq-question");
      btn.addEventListener("click", function(){
        var isOpen = item.classList.contains("is-open");
        items.forEach(function(i){
          i.classList.remove("is-open");
          i.querySelector(".faq-question").setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          item.classList.add("is-open");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  /* ============================================================
     MOBILE MENU
     ============================================================ */
  var burger = document.getElementById("burger");
  var mobileMenu = document.getElementById("mobile-menu");
  function closeMobileMenu(){
    if (!burger || !mobileMenu) return;
    burger.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    mobileMenu.hidden = true;
  }
  function initMobileMenu(){
    if (!burger || !mobileMenu) return;
    burger.addEventListener("click", function(){
      var willOpen = mobileMenu.hidden;
      mobileMenu.hidden = !willOpen;
      burger.classList.toggle("is-open", willOpen);
      burger.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });
  }

  /* ============================================================
     LEAD FORM + THANK YOU MODAL (reopen-safe)
     ============================================================ */
  function initForm(){
    var form = document.getElementById("lead-form");
    var modal = document.getElementById("thanks-modal");
    var closeBtn = document.getElementById("thanks-close");
    var okBtn = document.getElementById("thanks-ok");
    if (!form || !modal) return;

    function openModal(){
      // Reset any residual inline styles from previous close animation
      modal.style.opacity = "";
      modal.style.transform = "";
      if (typeof modal.showModal === "function") {
        modal.showModal();
      } else {
        modal.setAttribute("open", "");
      }
    }
    function closeModal(){
      modal.close ? modal.close() : modal.removeAttribute("open");
    }

    form.addEventListener("submit", function(e){
      e.preventDefault();
      var nameEl = form.querySelector('[name="name"]');
      var phoneEl = form.querySelector('[name="phone"]');
      var consentEl = form.querySelector('[name="consent"]');
      var name = nameEl.value.trim();
      var phone = phoneEl.value.trim();

      if (!name) { nameEl.focus(); return; }
      if (!phone) { phoneEl.focus(); return; }
      if (consentEl && !consentEl.checked) {
        form.classList.add("consent-missing");
        consentEl.focus();
        return;
      }
      form.classList.remove("consent-missing");

      // No real backend — simulate submit success
      openModal();
      form.reset();
    });
    // Clear the consent warning as soon as the user ticks the box
    var consentBox = form.querySelector('[name="consent"]');
    if (consentBox) {
      consentBox.addEventListener("change", function(){
        if (consentBox.checked) form.classList.remove("consent-missing");
      });
    }

    closeBtn.addEventListener("click", closeModal);
    okBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", function(e){
      var rect = modal.getBoundingClientRect();
      var inDialog = (
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top && e.clientY <= rect.bottom
      );
      if (!inDialog) closeModal();
    });
  }

  /* ============================================================
     HEADER SHADOW ON SCROLL (lightweight, no lib needed)
     ============================================================ */
  function initHeaderScrollState(){
    var header = document.getElementById("site-header");
    if (!header) return;
    function update(){
      if (window.scrollY > 12) header.style.boxShadow = "0 8px 24px -16px rgba(30,36,32,0.25)";
      else header.style.boxShadow = "none";
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ============================================================
     INIT
     ============================================================ */
  document.addEventListener("DOMContentLoaded", function(){
    initHero();
    initReveals();
    initPriceCounter();
    initMetrics();
    initBuildBar();
    initCalculator();
    initSeasonSwitcher();
    initTimelineProgress();
    initFaq();
    initMobileMenu();
    initForm();
    initHeaderScrollState();

    if (window.ScrollTrigger) {
      setTimeout(function(){ ScrollTrigger.refresh(); }, 300);
    }
  });
})();
