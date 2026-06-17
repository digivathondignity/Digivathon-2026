document.addEventListener('DOMContentLoaded', function() {
  const rootStyle = document.documentElement.style;
  let activeFaqAnswer = null;

  const updateFaqDesktopOffset = function(answer) {
    if (window.innerWidth < 1025 || !answer) {
      rootStyle.setProperty('--faq-desktop-offset', '0px');
      return;
    }

    const content = answer.querySelector('.faq-content');
    const extraSpace = content ? content.scrollHeight + 32 : 0;
    if (content) {
      answer.style.maxHeight = content.scrollHeight + 20 + 'px';
    }
    rootStyle.setProperty('--faq-desktop-offset', extraSpace + 'px');
  };

  const updateDesktopScale = function() {
    const viewportWidth = window.innerWidth;

    if (viewportWidth >= 1025 && viewportWidth <= 1440) {
      rootStyle.setProperty('--desktop-scale', String(viewportWidth / 1280));
    } else {
      rootStyle.removeProperty('--desktop-scale');
    }

    updateFaqDesktopOffset(activeFaqAnswer);
  };

  updateDesktopScale();

  let resizeTicking = false;
  window.addEventListener('resize', function() {
    if (!resizeTicking) {
      window.requestAnimationFrame(function() {
        updateDesktopScale();
        resizeTicking = false;
      });
      resizeTicking = true;
    }
  }, { passive: true });

  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link, .mobile-register-btn');

  if (hamburgerBtn && mobileMenu) {
    const closeMobileMenu = function() {
      hamburgerBtn.classList.remove('active');
      mobileMenu.classList.remove('active');
      mobileMenu.setAttribute('aria-hidden', 'true');
    };

    hamburgerBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      hamburgerBtn.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      mobileMenu.setAttribute('aria-hidden', String(!mobileMenu.classList.contains('active')));
    });

    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('click', function(e) {
      if (!hamburgerBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
        closeMobileMenu();
      }
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeMobileMenu();
      }
    });
  }

  const navbar = document.querySelector('.navbar');

  if (navbar) {
    let scrollTicking = false;
    let isScrolled = false;

    const updateNavbarState = function() {
      const shouldBeScrolled = window.scrollY > 50;

      if (shouldBeScrolled !== isScrolled) {
        navbar.classList.toggle('scrolled', shouldBeScrolled);
        isScrolled = shouldBeScrolled;
      }

      scrollTicking = false;
    };

    updateNavbarState();

    window.addEventListener('scroll', function() {
      if (!scrollTicking) {
        window.requestAnimationFrame(updateNavbarState);
        scrollTicking = true;
      }
    }, { passive: true });
  }

  const animatedSections = document.querySelectorAll('section, .kontak, footer');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedSections.forEach(section => {
      section.classList.add('fade-in-element');
      observer.observe(section);
    });
  } else {
    animatedSections.forEach(section => {
      section.classList.add('fade-in-visible');
    });
  }

  const faqContainer = document.querySelector('.group-38');
  const faqItems = faqContainer ? Array.from(faqContainer.querySelectorAll('.faq-item')) : [];

  const closeFaqItem = function(item) {
    const button = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (button && answer) {
      button.classList.remove('active');
      answer.classList.remove('open');
      answer.style.maxHeight = '0px';
      answer.style.opacity = '0';
    }
  };

  if (faqContainer) {
    faqContainer.addEventListener('click', function(e) {
      const button = e.target.closest('.faq-question');
      if (!button) return;

      e.preventDefault();

      const faqItem = button.closest('.faq-item');
      const answer = faqItem.querySelector('.faq-answer');
      const content = faqItem.querySelector('.faq-content');
      const isCurrentlyOpen = button.classList.contains('active');

      faqItems.forEach(item => {
        if (item !== faqItem) {
          closeFaqItem(item);
        }
      });

      if (!isCurrentlyOpen) {
        button.classList.add('active');
        answer.classList.add('open');
        answer.style.maxHeight = content.scrollHeight + 20 + 'px';
        answer.style.opacity = '1';
        activeFaqAnswer = answer;
        updateFaqDesktopOffset(answer);
      } else {
        closeFaqItem(faqItem);
        activeFaqAnswer = null;
        updateFaqDesktopOffset(null);
      }
    });
  }
});
