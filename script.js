/*==================== INITIALIZATION ====================*/
document.addEventListener("DOMContentLoaded", () => {
  initializeNavigation();
  initializeSkillsAccordion();
  initializePortfolioFilter();
  initializeContactForm();
  initializeScrollToTop();
  
  // New features
  initializeCustomCursor();
  setupSiteLoading();
});

/*==================== LOADING CONTROL SYSTEM ====================*/
function setupSiteLoading() {
  const preloader = document.getElementById("preloader");
  let isSiteStarted = false;

  function startSiteVisuals() {
    if (isSiteStarted) return;
    isSiteStarted = true;

    if (preloader) {
      preloader.style.opacity = "0";
      setTimeout(() => {
        preloader.style.display = "none";
        triggerVisuals();
      }, 500);
    } else {
      triggerVisuals();
    }
  }

  function triggerVisuals() {
    AOS.init({ duration: 800, offset: 50, once: true, easing: "ease-out-cubic" });
    initializeThreeScene();
    initializeTypingEffect();
  }

  window.addEventListener("load", () => { setTimeout(startSiteVisuals, 0); });
  setTimeout(startSiteVisuals, 3000);
}

/*==================== CUSTOM CURSOR ====================*/
function initializeCustomCursor() {
  const cursor = document.getElementById("custom-cursor");
  const ring = document.getElementById("cursor-ring");
  
  if (!cursor || !ring || window.innerWidth <= 768) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Move dot immediately
    cursor.style.left = mouseX + "px";
    cursor.style.top = mouseY + "px";
  });

  // Animate ring with slight delay (lerp)
  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = ringX + "px";
    ring.style.top = ringY + "px";
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effects on clickable elements
  const hoverTargets = document.querySelectorAll("a, button, .work__card, .skills__card");
  hoverTargets.forEach(target => {
    target.addEventListener("mouseenter", () => document.body.classList.add("hover-target"));
    target.addEventListener("mouseleave", () => document.body.classList.remove("hover-target"));
  });
}

/*==================== THREE.JS IOT SCENE ====================*/
function initializeThreeScene() {
  const canvas = document.getElementById("hero-canvas");
  const fallback = document.getElementById("canvas-fallback");
  
  // Check WebGL
  try {
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) throw new Error("WebGL not supported");
  } catch (e) {
    console.warn("WebGL not supported, using fallback.");
    if (canvas) canvas.style.display = "none";
    if (fallback) fallback.style.display = "block";
    return;
  }
  
  if (fallback) fallback.style.display = "none";

  // 1. Setup Scene
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0a0f, 0.05);

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 1.5, 8);

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  // Limit DPR on mobile for performance
  const dpr = window.innerWidth <= 768 ? 1 : Math.min(window.devicePixelRatio, 2);
  renderer.setPixelRatio(dpr);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // 2. Setup Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0x00e5ff, 0.5);
  dirLight.position.set(5, 5, 5);
  scene.add(dirLight);

  const backLight = new THREE.DirectionalLight(0xff9500, 0.3);
  backLight.position.set(-5, 5, -5);
  scene.add(backLight);

  // 3. Build IoT Setup Group
  const iotGroup = new THREE.Group();
  scene.add(iotGroup);

  // --- 3A. Smart Phone Model ---
  const phoneGroup = new THREE.Group();
  
  // Phone Body
  const phoneGeo = new THREE.BoxGeometry(1.4, 2.8, 0.15);
  const phoneMat = new THREE.MeshStandardMaterial({ 
    color: 0x111111, 
    roughness: 0.2, 
    metalness: 0.8 
  });
  const phoneBody = new THREE.Mesh(phoneGeo, phoneMat);
  phoneGroup.add(phoneBody);

  // Phone Screen
  const screenGeo = new THREE.PlaneGeometry(1.25, 2.65);
  const screenMat = new THREE.MeshStandardMaterial({ 
    color: 0x000000,
    emissive: 0x00e5ff,
    emissiveIntensity: 0.1,
    roughness: 0.1,
    metalness: 0.1
  });
  const phoneScreen = new THREE.Mesh(screenGeo, screenMat);
  phoneScreen.position.z = 0.076;
  phoneGroup.add(phoneScreen);

  phoneGroup.position.set(-1.5, 0, 0);
  phoneGroup.rotation.y = Math.PI / 6;
  iotGroup.add(phoneGroup);

  // --- 3B. IoT Lamp Model ---
  const lampGroup = new THREE.Group();

  // Lamp Base
  const baseGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.1, 32);
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.4, metalness: 0.9 });
  const lampBase = new THREE.Mesh(baseGeo, metalMat);
  lampBase.position.y = -1.35;
  lampGroup.add(lampBase);

  // Lamp Stand
  const standGeo = new THREE.CylinderGeometry(0.05, 0.05, 2, 16);
  const lampStand = new THREE.Mesh(standGeo, metalMat);
  lampStand.position.y = -0.4;
  lampStand.rotation.z = -0.2;
  lampGroup.add(lampStand);

  // Lamp Head
  const headGeo = new THREE.ConeGeometry(0.5, 0.8, 32);
  const headMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.6, metalness: 0.5 });
  const lampHead = new THREE.Mesh(headGeo, headMat);
  lampHead.position.set(0.3, 0.6, 0);
  lampHead.rotation.z = -1.2;
  lampGroup.add(lampHead);

  // Lamp Bulb (Emissive)
  const bulbGeo = new THREE.SphereGeometry(0.2, 16, 16);
  const bulbMat = new THREE.MeshStandardMaterial({ 
    color: 0xffffff,
    emissive: 0xff9500,
    emissiveIntensity: 0 // Starts OFF
  });
  const lampBulb = new THREE.Mesh(bulbGeo, bulbMat);
  lampBulb.position.set(0.5, 0.4, 0);
  lampGroup.add(lampBulb);

  // Actual PointLight
  const lampLight = new THREE.PointLight(0xff9500, 0, 10);
  lampLight.position.set(0.6, 0.3, 0);
  lampGroup.add(lampLight);

  lampGroup.position.set(1.5, 0, -1);
  lampGroup.rotation.y = -Math.PI / 4;
  iotGroup.add(lampGroup);

  // --- Particles (Data Flow) ---
  const particlesGeo = new THREE.BufferGeometry();
  const particlesCount = window.innerWidth <= 768 ? 300 : 800;
  const posArray = new Float32Array(particlesCount * 3);
  
  for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 15;
  }
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  const particlesMat = new THREE.PointsMaterial({
    size: 0.02,
    color: 0x00e5ff,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });
  const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
  scene.add(particlesMesh);

  // 4. HTML IoT Interaction
  const toggleBtn = document.getElementById("iot-led-toggle");
  const statusText = document.getElementById("lamp-status-text");
  let isLampOn = false;

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      isLampOn = !isLampOn;
      toggleBtn.classList.toggle("active");
      
      if (isLampOn) {
        statusText.textContent = "Status: ON";
        statusText.classList.add("active");
        
        // GSAP animate light ON
        gsap.to(lampLight, { intensity: 2, duration: 0.5, ease: "power2.out" });
        gsap.to(bulbMat, { emissiveIntensity: 2, duration: 0.5, ease: "power2.out" });
        gsap.to(screenMat, { emissiveIntensity: 0.5, duration: 0.5 }); // Phone screen reacts
      } else {
        statusText.textContent = "Status: OFF";
        statusText.classList.remove("active");
        
        // GSAP animate light OFF
        gsap.to(lampLight, { intensity: 0, duration: 0.5, ease: "power2.out" });
        gsap.to(bulbMat, { emissiveIntensity: 0, duration: 0.5, ease: "power2.out" });
        gsap.to(screenMat, { emissiveIntensity: 0.1, duration: 0.5 });
      }
    });
  }

  // 5. GSAP ScrollTrigger Animations
  gsap.registerPlugin(ScrollTrigger);

  // Animate the entire group based on scroll
  gsap.to(iotGroup.rotation, {
    y: Math.PI * 2,
    x: 0.5,
    ease: "none",
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 1
    }
  });

  gsap.to(iotGroup.position, {
    z: -5,
    y: 2,
    ease: "none",
    scrollTrigger: {
      trigger: "#about",
      start: "top bottom",
      end: "top top",
      scrub: 1
    }
  });

  // 6. Render Loop
  const clock = new THREE.Clock();
  
  // Mouse movement effect
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  
  if (window.innerWidth > 768) {
    document.addEventListener('mousemove', (event) => {
      mouseX = (event.clientX - window.innerWidth / 2);
      mouseY = (event.clientY - window.innerHeight / 2);
    });
  }

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Idle floating animation
    phoneGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.1;
    lampGroup.position.y = Math.sin(elapsedTime * 1.2 + Math.PI) * 0.1;

    // Particles slow rotation
    particlesMesh.rotation.y = elapsedTime * 0.05;

    // Mouse parallax
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;
    iotGroup.rotation.y += 0.05 * (targetX - iotGroup.rotation.y);
    iotGroup.rotation.x += 0.05 * (targetY - iotGroup.rotation.x);

    renderer.render(scene, camera);
  }
  animate();

  // 7. Resize Handler
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

/*==================== TYPING EFFECT ====================*/
function initializeTypingEffect() {
  const subtitle = document.querySelector(".home__subtitle");
  if (!subtitle) return;

  const textLoad = () => {
    setTimeout(() => { subtitle.textContent = "Flutter Developer"; }, 0);
    setTimeout(() => { subtitle.textContent = "IoT Engineer"; }, 4000);
    setTimeout(() => { subtitle.textContent = "Problem Solver"; }, 8000);
  };
  textLoad();
  setInterval(textLoad, 12000);
}

/*==================== NAVIGATION ====================*/
function initializeNavigation() {
  const navMenu = document.getElementById("nav-menu"),
    navToggle = document.getElementById("nav-toggle"),
    navClose = document.getElementById("nav-close"),
    navLinks = document.querySelectorAll(".nav__link"),
    header = document.getElementById("header");

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.add("show-menu");
    });
  }

  if (navClose) {
    navClose.addEventListener("click", () => {
      navMenu.classList.remove("show-menu");
    });
  }

  navLinks.forEach((n) =>
    n.addEventListener("click", () => {
      navMenu.classList.remove("show-menu");
    })
  );

  window.addEventListener("scroll", () => {
    if (window.scrollY >= 80) header.classList.add("scroll-header");
    else header.classList.remove("scroll-header");
  });

  const sections = document.querySelectorAll("section[id]");
  window.addEventListener("scroll", () => {
    const scrollY = window.pageYOffset;
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 50;
      const sectionId = current.getAttribute("id");
      const navLink = document.querySelector(".nav__menu a[href*=" + sectionId + "]");
      
      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add("active-link");
        } else {
          navLink.classList.remove("active-link");
        }
      }
    });
  });
}

/*==================== SKILLS ACCORDION ====================*/
function initializeSkillsAccordion() {
  // Legacy function kept for compatibility if needed
}

/*==================== PORTFOLIO FILTER ====================*/
function initializePortfolioFilter() {
  const filters = document.querySelectorAll(".work__item");
  const cards = document.querySelectorAll(".work__card");

  filters.forEach((filter) => {
    filter.addEventListener("click", function () {
      filters.forEach((f) => f.classList.remove("active-work"));
      this.classList.add("active-work");

      const category = this.getAttribute("data-filter");

      cards.forEach((card) => {
        if (category === "all" || card.classList.contains(category.substring(1))) {
          card.style.display = "block";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "scale(1)";
          }, 50);
        } else {
          card.style.opacity = "0";
          card.style.transform = "scale(0.8)";
          setTimeout(() => {
            card.style.display = "none";
          }, 400);
        }
      });
    });
  });
}

/*==================== CONTACT FORM ====================*/
function initializeContactForm() {
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector("button");
      const originalText = btn.innerHTML;

      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.style.opacity = "0.7";

      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
        btn.style.color = "#00e5ff";
        btn.style.opacity = "1";
        contactForm.reset();

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.color = "";
        }, 3000);
      }, 2000);
    });
  }
}

/*==================== SCROLL TO TOP ====================*/
function initializeScrollToTop() {
  const scrollUp = document.getElementById("scroll-up");
  if (scrollUp) {
    window.addEventListener("scroll", () => {
      if (window.scrollY >= 560) scrollUp.classList.add("show-scroll");
      else scrollUp.classList.remove("show-scroll");
    });
  }
}
