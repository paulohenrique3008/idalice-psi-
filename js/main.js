/**
 * INTERACTIVE SCRIPTS - DRA. IDALICE BARBOSA
 * JavaScript for carousel, faq accordions, sticky nav, mobile menu, and modals.
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initScrollSpy();
  initAccordions();
  initCarousel();
  initContactModal();
  initScrollReveal();
});

/* ==========================================================================
   STICKY HEADER
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  // Run on load in case page is already scrolled
  handleScroll();
}

/* ==========================================================================
   MOBILE MENU (HAMBURGER / DRAWER)
   ========================================================================== */
function initMobileMenu() {
  const burgerBtn = document.querySelector('.burger-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  const overlay = document.querySelector('.mobile-nav-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!burgerBtn || !mobileNav || !overlay) return;

  const toggleMenu = () => {
    burgerBtn.classList.toggle('burger-open');
    mobileNav.classList.toggle('mobile-nav-open');
    overlay.classList.toggle('mobile-nav-overlay-active');
    
    // Toggle body scroll locking
    if (mobileNav.classList.contains('mobile-nav-open')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  burgerBtn.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Close menu when a link is clicked
      if (mobileNav.classList.contains('mobile-nav-open')) {
        toggleMenu();
      }
    });
  });
}

/* ==========================================================================
   SCROLLSPY (ACTIVE NAV LINK ON SCROLL)
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (!sections.length || !navLinks.length) return;

  const activeLink = (id) => {
    // Desktop Nav
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${id}`) {
        link.classList.add('active');
      }
    });
    // Mobile Nav
    mobileNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${id}`) {
        link.classList.add('active');
      }
    });
  };

  const handleScrollSpy = () => {
    const scrollPosition = window.scrollY + 120; // offset for sticky header

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        activeLink(id);
      }
    });
  };

  window.addEventListener('scroll', handleScrollSpy);
  handleScrollSpy();
}

/* ==========================================================================
   UNIFIED ACCORDION SYSTEM
   ========================================================================== */
function initAccordions() {
  const triggers = document.querySelectorAll('.accordion-trigger');
  
  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      if (!item) return;
      const content = item.querySelector('.accordion-content');
      if (!content) return;
      const isOpen = item.classList.contains('accordion-open');
      const group = item.closest('.accordion-group');
      
      // If part of an accordion group, close all other items in that specific group
      if (group) {
        group.querySelectorAll('.accordion-item').forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('accordion-open');
            const otherContent = otherItem.querySelector('.accordion-content');
            if (otherContent) {
              otherContent.style.maxHeight = null;
            }
            const otherTrigger = otherItem.querySelector('.accordion-trigger');
            if (otherTrigger) {
              otherTrigger.setAttribute('aria-expanded', 'false');
            }
          }
        });
      }
      
      // Toggle current item state
      if (isOpen) {
        item.classList.remove('accordion-open');
        content.style.maxHeight = null;
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('accordion-open');
        content.style.maxHeight = content.scrollHeight + 'px';
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   TESTIMONIALS CAROUSEL
   ========================================================================== */
function initCarousel() {
  const track = document.querySelector('.carousel-track');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const dotsContainer = document.querySelector('.carousel-dots');

  if (!track || !slides.length) return;

  let currentIndex = 0;
  let autoPlayTimer = null;
  const autoPlayDelay = 6000;

  // Create indicator dots dynamically
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.classList.add('carousel-dot');
    if (index === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', `Ir para depoimento ${index + 1}`);
    dot.addEventListener('click', () => {
      goToSlide(index);
      resetAutoPlay();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.carousel-dot');

  const updateSlideClasses = () => {
    slides.forEach((slide, idx) => {
      slide.classList.remove('active');
      if (idx === currentIndex) {
        slide.classList.add('active');
      }
    });
  };

  const goToSlide = (index) => {
    if (index < 0) {
      currentIndex = slides.length - 1;
    } else if (index >= slides.length) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Update dots
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[currentIndex]) {
      dots[currentIndex].classList.add('active');
    }
    
    updateSlideClasses();
  };

  const nextSlide = () => goToSlide(currentIndex + 1);
  const prevSlide = () => goToSlide(currentIndex - 1);

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoPlay();
    });
  }

  // AutoPlay logic
  const startAutoPlay = () => {
    autoPlayTimer = setInterval(nextSlide, autoPlayDelay);
  };

  const stopAutoPlay = () => {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
  };

  const resetAutoPlay = () => {
    stopAutoPlay();
    startAutoPlay();
  };

  // Touch gestures support for mobile devices
  let startX = 0;
  let endX = 0;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    stopAutoPlay();
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
    startAutoPlay();
  }, { passive: true });

  const handleSwipe = () => {
    const diff = startX - endX;
    const swipeThreshold = 50; // pixels
    if (diff > swipeThreshold) {
      nextSlide();
    } else if (diff < -swipeThreshold) {
      prevSlide();
    }
  };

  // Init
  updateSlideClasses();
  startAutoPlay();
}

/* ==========================================================================
   CONTACT / APPOINTMENT FORM MODAL
   ========================================================================== */
function initContactModal() {
  const modal = document.querySelector('.modal');
  const closeBtn = document.querySelector('.modal-close-btn');
  const triggerBtns = document.querySelectorAll('.open-modal-btn');
  const form = document.querySelector('.modal-form');

  if (!modal || !closeBtn) return;

  const openModal = (e) => {
    if (e) e.preventDefault();
    modal.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('modal-open');
    document.body.style.overflow = '';
  };

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  closeBtn.addEventListener('click', closeModal);

  // Close modal when clicking outside content area
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // ESC key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('modal-open')) {
      closeModal();
    }
  });

  // Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = form.querySelector('#form-name').value;
      const phone = form.querySelector('#form-phone').value;
      const service = form.querySelector('#form-service').value;
      const message = form.querySelector('#form-message').value;

      // Format WhatsApp Message
      const whatsappText = `Olá Dra. Idalice! Me chamo ${name}. Gostaria de agendar uma consulta para: *${service}*.\n\n_Mensagem:_ ${message}\n_Telefone:_ ${phone}`;
      const encodedText = encodeURIComponent(whatsappText);
      const whatsappUrl = `https://wa.me/558599381776?text=${encodedText}`;

      // Open in new tab and close modal
      window.open(whatsappUrl, '_blank');
      closeModal();
      form.reset();
    });
  }
}

/* ==========================================================================
   SCROLL REVEAL (INTERSECTION OBSERVER ANIMATIONS)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    observer.observe(el);
  });
}
