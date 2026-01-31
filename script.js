/*==================== INITIALIZATION ====================*/
document.addEventListener("DOMContentLoaded", () => {
  // 1. تشغيل الأساسيات الوظيفية فوراً (عشان الموقع يكون جاهز تحت اللودر)
  initializeNavigation();
  initializeSkillsAccordion();
  initializePortfolioFilter();
  initializeContactForm();
  initializeThemeToggle();
  initializeScrollToTop();
  initializePhoneMockup();
  initializeFlutterCounter();

  // 2. الموتور الجديد: هو اللي هيتحكم امتى الأنيميشن يبدأ
  setupSiteLoading();

  // توقيع المطور
  console.log(
    "%c👋 Hello Developer!",
    "color: #667eea; font-size: 20px; font-weight: bold;",
  );
  console.log(
    "%cBuilt with passion by Amr Abdelazeem 🚀",
    "color: #764ba2; font-size: 14px;",
  );
});

/*==================== LOADING CONTROL SYSTEM (New Engine) ====================*/
function setupSiteLoading() {
  const preloader = document.getElementById("preloader");
  let isSiteStarted = false;

  function startSiteVisuals() {
    if (isSiteStarted) return;
    isSiteStarted = true;

    if (preloader) {
      // 1. ابدأ اخفي اللودر
      preloader.style.opacity = "0";

      // 2. استنى 500ms لحد ما يختفي خالص
      setTimeout(() => {
        preloader.style.display = "none";

        // 🔥 3. دلوقتي بس شغل الأنيميشن والموبايل 🔥
        triggerVisuals();
      }, 100); // نفس مدة الانتقال في CSS
    } else {
      triggerVisuals();
    }
  }

  function triggerVisuals() {
    AOS.init({
      duration: 800,
      offset: 50,
      once: true,
      easing: "ease-out-cubic",
    });
    initializeTypingEffect();
    initializeParticles();
    initializeScrollAnimations();

    // تشغيل إقلاع الموبايل
    startPhoneBoot();
  }

  window.addEventListener("load", () => {
    setTimeout(startSiteVisuals, 0);
  });
  setTimeout(startSiteVisuals, 3000);
}
/*==================== NAVIGATION ====================*/
function initializeNavigation() {
  const navMenu = document.getElementById("nav-menu"),
    navToggle = document.getElementById("nav-toggle"),
    navClose = document.getElementById("nav-close"),
    navLinks = document.querySelectorAll(".nav__link"),
    header = document.getElementById("header");

  // فتح القائمة (للشاشات الصغيرة)
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.add("show-menu");
    });
  }

  // إغلاق القائمة
  if (navClose) {
    navClose.addEventListener("click", () => {
      navMenu.classList.remove("show-menu");
    });
  }

  // إغلاق القائمة عند الضغط على أي رابط
  navLinks.forEach((n) =>
    n.addEventListener("click", () => {
      navMenu.classList.remove("show-menu");
    }),
  );

  // تغيير خلفية الهيدر عند السكرول
  window.addEventListener("scroll", () => {
    if (window.scrollY >= 80) header.classList.add("scroll-header");
    else header.classList.remove("scroll-header");
  });

  // تلوين الرابط النشط بناءً على القسم الحالي
  const sections = document.querySelectorAll("section[id]");
  window.addEventListener("scroll", () => {
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 50;
      const sectionId = current.getAttribute("id");

      // تأكد أن العنصر موجود قبل محاولة إضافة كلاس
      const navLink = document.querySelector(
        ".nav__menu a[href*=" + sectionId + "]",
      );
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
/*==================== SKILLS ACCORDION (FIXED) ====================*/
/*==================== SKILLS ACCORDION (FINAL FIX) ====================*/
function initializeSkillsAccordion() {
  const skillsHeader = document.querySelectorAll(".skills__header");

  function toggleSkills() {
    // بنجيب الأب (اللي هو الصندوق كامل)
    const item = this.parentNode;

    // لو هو مقفول -> افتحه
    if (item.classList.contains("skills__close")) {
      item.classList.remove("skills__close");
      item.classList.add("skills__open");
    }
    // لو هو مفتوح -> اقفله
    else {
      item.classList.remove("skills__open");
      item.classList.add("skills__close");
    }
  }

  skillsHeader.forEach((el) => {
    el.addEventListener("click", toggleSkills);
  });
}

/*==================== PORTFOLIO FILTER (UPDATED & FIXED) ====================*/
function initializePortfolioFilter() {
  const filters = document.querySelectorAll(".work__item");
  const cards = document.querySelectorAll(".work__card");

  filters.forEach((filter) => {
    filter.addEventListener("click", function () {
      // إزالة الكلاس النشط من جميع الفلاتر وإضافته للزر المضغوط
      filters.forEach((f) => f.classList.remove("active-work"));
      this.classList.add("active-work");

      const category = this.getAttribute("data-filter");

      cards.forEach((card) => {
        // إعادة تعيين الأنيميشن
        card.style.transition = "none";

        if (
          category === "all" ||
          card.classList.contains(category.substring(1))
        ) {
          // إظهار العنصر
          card.style.display = "block";
          setTimeout(() => {
            card.style.transition = "all 0.4s ease";
            card.style.opacity = "1";
            card.style.transform = "scale(1)";
          }, 50); // تأخير بسيط جداً للسماح للمتصفح برسم العنصر
        } else {
          // إخفاء العنصر
          card.style.transition = "all 0.4s ease";
          card.style.opacity = "0";
          card.style.transform = "scale(0.8)";
          setTimeout(() => {
            card.style.display = "none";
          }, 400); // الانتظار حتى انتهاء الأنيميشن
        }
      });
    });
  });
}

/*==================== SCROLL ANIMATIONS (Intersection Observer) ====================*/
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-active");

        // تحريك عداد الأرقام (Stats)
        if (
          entry.target.classList.contains("about__info") ||
          entry.target.closest(".about__info")
        ) {
          // يمكن إضافة دالة animateCounters هنا إذا أردت
        }

        // تحريك شرائط المهارات (Progress Bars)
        if (entry.target.classList.contains("skills__open")) {
          const bars = entry.target.querySelectorAll(".skills__percentage");
          // CSS Transitions ستتولى المهمة بمجرد ظهور العنصر
        }
      }
    });
  }, observerOptions);

  // العناصر المراد تحريكها
  const elementsToAnimate = document.querySelectorAll(
    ".section__title, .about__img, .about__data, .work__card, .contact__content, .experience__data",
  );

  elementsToAnimate.forEach((el) => {
    // تهيئة الستايل المبدئي (مخفي)
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
    observer.observe(el);
  });

  // إضافة كلاس عند الظهور
  window.addEventListener("scroll", () => {
    elementsToAnimate.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight - 50) {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }
    });
  });
}

/*==================== TYPING EFFECT ====================*/
function initializeTypingEffect() {
  const subtitle = document.querySelector(".home__subtitle");
  if (!subtitle) return;

  const textLoad = () => {
    setTimeout(() => {
      subtitle.textContent = "Flutter Developer";
    }, 0);
    setTimeout(() => {
      subtitle.textContent = "IoT Engineer";
    }, 4000);
    setTimeout(() => {
      subtitle.textContent = "Problem Solver";
    }, 8000);
  };

  // التشغيل المبدئي
  textLoad();
  // التكرار كل 12 ثانية
  setInterval(textLoad, 12000);
}

/*==================== PARTICLES BACKGROUND ====================*/
function initializeParticles() {
  const hero = document.querySelector(".home");
  if (!hero) return;

  // إنشاء حاوية للجسيمات لتجنب مشاكل التخطيط
  const particlesContainer = document.createElement("div");
  particlesContainer.style.position = "absolute";
  particlesContainer.style.top = "0";
  particlesContainer.style.left = "0";
  particlesContainer.style.width = "100%";
  particlesContainer.style.height = "100%";
  particlesContainer.style.overflow = "hidden";
  particlesContainer.style.pointerEvents = "none"; // عشان ما تمنعش الضغط على الأزرار
  particlesContainer.style.zIndex = "0";

  hero.insertBefore(particlesContainer, hero.firstChild);

  for (let i = 0; i < 15; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.cssText = `
              position: absolute;
              width: ${Math.random() * 5 + 2}px;
              height: ${Math.random() * 5 + 2}px;
              background: rgba(102, 126, 234, 0.2); /* لون شفاف */
              border-radius: 50%;
              left: ${Math.random() * 100}%;
              top: ${Math.random() * 100}%;
              animation: float-particle ${
                Math.random() * 15 + 10
              }s infinite linear;
          `;
    particlesContainer.appendChild(particle);
  }

  // إضافة Keyframes للأنيميشن
  const style = document.createElement("style");
  style.innerHTML = `
          @keyframes float-particle {
              0% { transform: translateY(0) rotate(0deg); opacity: 0; }
              50% { opacity: 0.6; }
              100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
          }
      `;
  document.head.appendChild(style);
}

/*==================== DARK/LIGHT THEME ====================*/
function initializeThemeToggle() {
  const themeButton = document.getElementById("theme-button");
  const darkTheme = "dark-theme";
  const iconTheme = "fa-sun";

  // استرجاع الثيم المحفوظ
  const selectedTheme = localStorage.getItem("selected-theme");
  const selectedIcon = localStorage.getItem("selected-icon");

  const getCurrentTheme = () =>
    document.body.classList.contains(darkTheme) ? "dark" : "light";
  const getCurrentIcon = () =>
    themeButton.classList.contains(iconTheme) ? "fa-moon" : "fa-sun";

  if (selectedTheme) {
    document.body.classList[selectedTheme === "dark" ? "add" : "remove"](
      darkTheme,
    );
    themeButton.classList[selectedIcon === "fa-moon" ? "add" : "remove"](
      iconTheme,
    );
  }

  if (themeButton) {
    themeButton.addEventListener("click", () => {
      document.body.classList.toggle(darkTheme);
      themeButton.classList.toggle(iconTheme);
      localStorage.setItem("selected-theme", getCurrentTheme());
      localStorage.setItem("selected-icon", getCurrentIcon());
    });
  }
}

/*==================== CONTACT FORM ====================*/
function initializeContactForm() {
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector("button");
      const originalText = btn.innerHTML;

      // تغيير شكل الزر أثناء الإرسال
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.style.opacity = "0.7";

      // محاكاة الإرسال
      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        btn.style.backgroundColor = "#2ecc71"; // لون أخضر للنجاح
        btn.style.opacity = "1";

        contactForm.reset(); // مسح البيانات

        // إرجاع الزر لحالته الأصلية
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.backgroundColor = "";
        }, 3000);
      }, 2000);
    });
  }
}

/*==================== PRELOADER ====================*/

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
/*=============== MIXITUP FILTER PORTFOLIO ===============*/
let mixerPortfolio = mixitup(".work__container", {
  selectors: {
    target: ".work__card",
  },
  animation: {
    duration: 300,
  },
});

/* Link active work (تغيير لون الفلتر النشط) */
const linkWork = document.querySelectorAll(".work__item");

function activeWork() {
  linkWork.forEach((l) => l.classList.remove("active-work"));
  this.classList.add("active-work");
}

linkWork.forEach((l) => l.addEventListener("click", activeWork));

/*==================== INTERACTIVE PHONE MOCKUP ====================*/
/*==================== INTERACTIVE PHONE MOCKUP (FIXED) ====================*/
/*==================== INTERACTIVE PHONE MOCKUP (MOBILE OPTIMIZED) ====================*/
/*==================== INTERACTIVE PHONE MOCKUP (Movement Only) ====================*/
function initializePhoneMockup() {
  const phone = document.getElementById("phone");
  const lightEffect = document.querySelector(".light-effect");

  if (phone) {
    let mouseX = 0,
      mouseY = 0,
      currentX = 0,
      currentY = 0;

    document.addEventListener("mousemove", (e) => {
      if (window.innerWidth <= 768) return;
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (lightEffect) {
        const rect = phone.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        lightEffect.style.setProperty("--mouse-x", `${x}%`);
        lightEffect.style.setProperty("--mouse-y", `${y}%`);
      }
    });

    function animate() {
      if (window.innerWidth <= 768) {
        phone.style.transform = `perspective(1000px) rotateX(0) rotateY(0) translateZ(0)`;
        return;
      }
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const deltaX = (mouseX - centerX) / centerX;
      const deltaY = (mouseY - centerY) / centerY;
      currentX += (deltaX - currentX) * 0.1;
      currentY += (deltaY - currentY) * 0.1;
      const rotateY = currentX * 12;
      const rotateX = -currentY * 12;
      phone.style.transform = `perspective(1500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
      requestAnimationFrame(animate);
    }
    animate();
  }
}
/*==================== PHONE BOOT SEQUENCE ====================*/
/*==================== PHONE BOOT SEQUENCE (Fixed) ====================*/
function startPhoneBoot() {
  const bootScreen = document.getElementById("bootScreen");
  const codeScreen = document.getElementById("codeScreen");

  const homeSection = document.querySelector(".home");
  // تحديد الوقت
  const isMobile = window.innerWidth <= 768;
  const bootTime = isMobile ? 1200 : 3000; // وقت ظهور شعار فلاتر

  if (bootScreen && codeScreen) {
    // 1. 🔥 أهم خطوة: تشغيل الشاشة والأنيميشن الآن 🔥
    // ده اللي هيخلي الشاشة السوداء تنور ويبدأ اللوجو يتحرك
    bootScreen.classList.add("active");

    // 2. بعد ما الوقت يخلص، اخفي البوت واظهر الكود
    setTimeout(() => {
      bootScreen.classList.remove("active");

      if (!isMobile) {
        setTimeout(() => {
          codeScreen.classList.add("active");
        }, 250);
      } else {
        setTimeout(() => {
          if (homeSection) {
            homeSection.classList.add("content-visible");
          }
        }, 250);
      }
    }, bootTime);
  }
}
/*==================== FLUTTER COUNTER FUNCTIONALITY ====================*/
function initializeFlutterCounter() {
  const counterFab = document.getElementById("counterFab");
  const counterNumber = document.getElementById("counterNumber");

  // التأكد إن العناصر موجودة فعلاً في الصفحة
  if (counterFab && counterNumber) {
    let count = 0;

    counterFab.addEventListener("click", function (e) {
      // 1. منع الدوسة توصل للموبايل (الحل السحري)
      e.stopPropagation();

      // 2. تزويد العداد
      count++;
      counterNumber.textContent = count;

      // 3. حركة الزرار (Click Effect)
      this.classList.add("clicked");

      // 4. أنيميشن الرقم (Reflow Trick)
      counterNumber.style.animation = "none";
      counterNumber.offsetHeight; /* trigger reflow */
      counterNumber.style.animation = "counterPop 0.3s ease-out";

      // 5. تنظيف الكلاس
      setTimeout(() => {
        this.classList.remove("clicked");
      }, 600);
    });
  } else {
    // لو ظهرت الرسالة دي في الكونسول، يبقى فيه مشكلة في الـ HTML IDs
    console.error("Flutter Counter Elements NOT Found! Check HTML IDs.");
  }
}
