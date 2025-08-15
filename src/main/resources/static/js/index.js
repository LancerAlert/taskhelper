/**
 * Index Page JavaScript - TaskHelper
 * Features: AOS scroll animations, CountUp statistics, Swiper testimonials, MicroModal, smooth scrolling
 */

// console.log('TaskHelper Index: Initializing page...');

/* ==========================================================================
   AOS (Animate on Scroll) Library Initialization
   ========================================================================== */
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-back',
      once: true,
      offset: 100,
      delay: 0
    });
    // console.log('AOS initialized successfully');
  } else {
    // console.error('AOS library not found');
  }
}


/* ==========================================================================
   CountUp.js Library for Statistics Animation
   ========================================================================== */
function initCountUp() {
  const CountUpLib = window.CountUp || (window.countUp && window.countUp.CountUp) || null;
  
  if (CountUpLib) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counters = entry.target.querySelectorAll('.countup-number');
          
          counters.forEach((counter, index) => {
            const target = parseFloat(counter.dataset.target);
            const decimals = parseInt(counter.dataset.decimals) || 0;
            const suffix = counter.dataset.suffix || '';
            
            setTimeout(() => {
              const countUp = new CountUpLib(counter, target, {
                startVal: 0,
                decimalPlaces: decimals,
                duration: 2,
                useGrouping: false,
                suffix,
                easingFn: (t, b, c, d) => c * (1 - Math.pow(1 - t / d, 3)) + b
              });
              
              if (!countUp.error) {
                countUp.start();
              }
            }, index * 200);
          });
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });

    const statsSection = document.querySelector('.stats');
    if (statsSection) observer.observe(statsSection);
  } else {
    initFallbackCountUp();
  }
}

/* Fallback implementation when CountUp.js library is unavailable */
function initFallbackCountUp() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counters = entry.target.querySelectorAll('.countup-number');
        
        counters.forEach((counter, index) => {
          const target = parseFloat(counter.dataset.target);
          const decimals = parseInt(counter.dataset.decimals) || 0;
          const suffix = counter.dataset.suffix || '';
          
          setTimeout(() => animateNumber(counter, 0, target, 2000, decimals, suffix), index * 200);
        });
        
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });

  const statsSection = document.querySelector('.stats');
  if (statsSection) observer.observe(statsSection);
}

/* Custom number animation fallback using requestAnimationFrame */
function animateNumber(element, start, end, duration, decimals = 0, suffix = '') {
  const startTime = performance.now();
  const range = end - start;
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = start + (range * easeOut);
    
    const formatted = decimals > 0 ? current.toFixed(decimals) : Math.floor(current);
    element.textContent = formatted + suffix;
    
    if (progress < 1) requestAnimationFrame(update);
  }
  
  requestAnimationFrame(update);
}

/* ==========================================================================
   Swiper.js Library for Testimonials Carousel
   ========================================================================== */
function initTestimonialsSwiper() {
  if (typeof Swiper === 'undefined') {
    // console.error('Swiper library not found');
    return;
  }

  new Swiper('.testimonials-swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: { delay: 4000, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true, dynamicBullets: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    breakpoints: {
      640: { slidesPerView: 1 },
      768: { slidesPerView: 2, spaceBetween: 40 },
      1024: { slidesPerView: 3, spaceBetween: 50 }
    },
    effect: 'slide',
    speed: 600
  });
}

/* ==========================================================================
   MicroModal Library for Lightweight Modal Dialogs
   ========================================================================== */
function initMicroModal() {
  if (typeof MicroModal === 'undefined') {
    // console.error('MicroModal library not found');
    return;
  }

  MicroModal.init({
    openTrigger: 'data-micromodal-trigger',
    closeTrigger: 'data-micromodal-close',
    openClass: 'is-open',
    disableScroll: true,
    disableFocus: false,
    awaitOpenAnimation: false,
    awaitCloseAnimation: false,
    debugMode: false
  });
}

/* ==========================================================================
   Smooth Scrolling for Anchor Links
   ========================================================================== */
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetElement = document.querySelector(this.getAttribute('href'));
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ==========================================================================
   Main Initialization Function
   ========================================================================== */
function initIndexPage() {
  initAOS();
  initCountUp();
  initTestimonialsSwiper();
  initMicroModal();
  initSmoothScrolling();
  
  // console.log('TaskHelper Index: Page initialized with AOS scroll animations');
}

/* ==========================================================================
   DOM Ready Event Listener
   ========================================================================== */
document.addEventListener('DOMContentLoaded', initIndexPage);