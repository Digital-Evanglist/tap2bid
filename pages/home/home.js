"use strict";

// Home page interactions only
document.addEventListener("DOMContentLoaded", () => {
  // Focus ring improvement for keyboard users on CTA
  const cta = document.querySelector(".hero__actions .btn");
  if (cta) {
    cta.addEventListener("focus", () => {
      cta.style.boxShadow = "0 0 0 4px color-mix(in srgb, var(--color-primary) 30%, transparent)";
    });
    cta.addEventListener("blur", () => {
      cta.style.boxShadow = "";
    });
  }

  // Accordion animation logic
  const accordions = document.querySelectorAll('.why-choose__card');

  accordions.forEach((details) => {
    const summary = details.querySelector('summary');
    const content = details.querySelector('.why-choose__card-desc');

    summary?.addEventListener('click', function (e) {
      e.preventDefault();

      if (details.open) {
        animateClose(details, content);
      } else {
        // Close all others
        accordions.forEach((other) => {
          if (other !== details && other.open) {
            animateClose(other, other.querySelector('.why-choose__card-desc'));
          }
        });
        animateOpen(details, content);
      }
    });

    details.addEventListener('toggle', function () {
      if (details.open && !content.style.maxHeight) {
        details.open = false;
      }
    });
  });

  function animateOpen(details, content) {
    details.open = true;
    details.classList.add('why-choose__card--animating');
    content.style.display = 'block';
    content.style.overflow = 'hidden';
    content.style.maxHeight = '0px';
    content.style.opacity = '0';

    requestAnimationFrame(() => {
      content.style.transition = 'max-height 0.5s cubic-bezier(.4,0,.2,1), opacity 0.4s';
      content.style.maxHeight = content.scrollHeight + 'px';
      content.style.opacity = '1';
    });

    setTimeout(() => {
      content.style.maxHeight = '';
      content.style.overflow = '';
      content.style.transition = '';
      details.classList.remove('why-choose__card--animating');
    }, 500);
  }

  function animateClose(details, content) {
    details.classList.add('why-choose__card--animating');
    content.style.overflow = 'hidden';
    content.style.transition = 'max-height 0.4s cubic-bezier(.4,0,.2,1), opacity 0.3s';
    content.style.maxHeight = content.scrollHeight + 'px';
    content.style.opacity = '1';

    requestAnimationFrame(() => {
      content.style.maxHeight = '0px';
      content.style.opacity = '0';
    });

    setTimeout(() => {
      details.open = false;
      content.style.display = '';
      content.style.maxHeight = '';
      content.style.overflow = '';
      content.style.transition = '';
      content.style.opacity = '';
      details.classList.remove('why-choose__card--animating');
    }, 400);
  }

  // Enhanced How to Begin Section Animations
  const howToBeginSection = document.querySelector('.how-to-begin');
  const stepItems = document.querySelectorAll('.step-item');
  const floatingElements = document.querySelectorAll('.floating-element');
  const floatingBadges = document.querySelectorAll('.floating-badge');
  const imageStacks = document.querySelectorAll('[data-parallax]');

  // Scroll-triggered animations for step items
  function initStepAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '0px 0px -50px 0px'
    });

    stepItems.forEach(step => {
      observer.observe(step);
    });
  }

  // Parallax effect for images
  function handleParallax() {
    if (!howToBeginSection) return;
    
    const rect = howToBeginSection.getBoundingClientRect();
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    imageStacks.forEach(stack => {
      const speed = parseFloat(stack.getAttribute('data-parallax')) || 0.1;
      const yPos = -(scrolled * speed);
      stack.style.transform = `translateY(${yPos}px)`;
    });
  }

  // Floating elements animation
  function animateFloatingElements() {
    floatingElements.forEach((element, index) => {
      element.style.animationDelay = `${index * 0.5}s`;
    });
    
    floatingBadges.forEach((badge, index) => {
      badge.style.animationDelay = `${index * 0.8}s`;
    });
  }

  // Initialize animations
  if (howToBeginSection) {
    initStepAnimations(); // Initialize scroll-triggered animations
    animateFloatingElements();
    
    // Add scroll event for parallax
    window.addEventListener('scroll', handleParallax);
    
    // Add hover effects for step items
    stepItems.forEach(step => {
      step.addEventListener('mouseenter', () => {
        step.style.transform = 'translateX(0) scale(1.02)';
      });
      
      step.addEventListener('mouseleave', () => {
        step.style.transform = 'translateX(0) scale(1)';
      });
    });
  }

  // Interactive Services Section
  const serviceItems = document.querySelectorAll('.service-item');
  const serviceContents = document.querySelectorAll('.service-content');

  serviceItems.forEach(item => {
    item.addEventListener('click', () => {
      const serviceType = item.getAttribute('data-service');
      
      // Remove active class from all items and contents
      serviceItems.forEach(i => i.classList.remove('active'));
      serviceContents.forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked item
      item.classList.add('active');
      
      // Show corresponding content
      const targetContent = document.querySelector(`.service-content[data-service="${serviceType}"]`);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });

  // Keyboard navigation for accessibility
  serviceItems.forEach(item => {
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
    
    // Make items focusable
    item.setAttribute('tabindex', '0');
  });

  // Construction Projects Gallery Functionality
  const projectsGallery = document.querySelector('.projects-gallery');
  if (projectsGallery) {
    const galleryTrack = projectsGallery.querySelector('.gallery-track');
    const projectCards = projectsGallery.querySelectorAll('.project-card');
    const prevBtn = projectsGallery.querySelector('.control-btn--prev');
    const nextBtn = projectsGallery.querySelector('.control-btn--next');
    const dots = projectsGallery.querySelectorAll('.dot');
    
    let currentSlide = 0;
    const totalSlides = projectCards.length - 1; // Exclude duplicate card
    const cardWidth = 400; // Match CSS flex-basis
    const gap = 32; // Match CSS gap (2rem)
    
    // Initialize gallery
    function initGallery() {
      // Set initial position
      updateGalleryPosition();
      
      // Add click event to project cards
      projectCards.forEach((card, index) => {
        if (index < totalSlides) { // Only add to non-duplicate cards
          card.addEventListener('click', () => {
            showProjectDetails(card.getAttribute('data-project'));
          });
        }
      });
      
      // Add navigation events
      if (prevBtn) prevBtn.addEventListener('click', goToPrevSlide);
      if (nextBtn) nextBtn.addEventListener('click', goToNextSlide);
      
      // Add dot navigation
      dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
      });
      
      // Add keyboard navigation
      document.addEventListener('keydown', handleKeyboardNavigation);
      
      // Add touch/swipe support for mobile
      addTouchSupport();
      
      // Auto-play gallery
      startAutoPlay();
    }
    
    // Update gallery position
    function updateGalleryPosition() {
      const translateX = -(currentSlide * (cardWidth + gap));
      galleryTrack.style.transform = `translateX(${translateX}px)`;
      
      // Update active dot
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
      });
      
      // Update navigation buttons
      if (prevBtn) prevBtn.disabled = currentSlide === 0;
      if (nextBtn) nextBtn.disabled = currentSlide === totalSlides - 1;
    }
    
    // Navigation functions
    function goToNextSlide() {
      if (currentSlide < totalSlides - 1) {
        currentSlide++;
        updateGalleryPosition();
      }
    }
    
    function goToPrevSlide() {
      if (currentSlide > 0) {
        currentSlide--;
        updateGalleryPosition();
      }
    }
    
    function goToSlide(slideIndex) {
      if (slideIndex >= 0 && slideIndex < totalSlides) {
        currentSlide = slideIndex;
        updateGalleryPosition();
      }
    }
    
    // Keyboard navigation
    function handleKeyboardNavigation(e) {
      if (e.key === 'ArrowLeft') {
        goToPrevSlide();
      } else if (e.key === 'ArrowRight') {
        goToNextSlide();
      }
    }
    
    // Touch/swipe support
    function addTouchSupport() {
      let startX = 0;
      let startY = 0;
      let isDragging = false;
      
      galleryTrack.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
      });
      
      galleryTrack.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = startX - currentX;
        const diffY = startY - currentY;
        
        // Check if horizontal swipe is more significant than vertical
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
          e.preventDefault();
          
          if (diffX > 0) {
            goToNextSlide();
          } else {
            goToPrevSlide();
          }
          
          isDragging = false;
        }
      });
      
      galleryTrack.addEventListener('touchend', () => {
        isDragging = false;
      });
    }
    
    // Auto-play functionality
    let autoPlayInterval;
    
    function startAutoPlay() {
      autoPlayInterval = setInterval(() => {
        if (currentSlide < totalSlides - 1) {
          goToNextSlide();
        } else {
          currentSlide = 0;
          updateGalleryPosition();
        }
      }, 5000); // Change slide every 5 seconds
    }
    
    function stopAutoPlay() {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
      }
    }
    
    // Pause auto-play on hover
    projectsGallery.addEventListener('mouseenter', stopAutoPlay);
    projectsGallery.addEventListener('mouseleave', startAutoPlay);
    
    // Project details modal (placeholder function)
    function showProjectDetails(projectId) {
      console.log(`Showing details for project ${projectId}`);
      // Here you can implement a modal or navigation to project details
      // For now, we'll just log the project ID
    }
    
    // Initialize the gallery
    initGallery();
  }

  // Achievement badges animation
  const achievementBadges = document.querySelectorAll('.achievement-badge');
  if (achievementBadges.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '0px 0px -50px 0px'
    });
    
    achievementBadges.forEach(badge => {
      badge.style.animationPlayState = 'paused';
      observer.observe(badge);
    });
  }

  // Testimonials Section Enhancements
  const testimonialsSection = document.querySelector('.testimonials');
  if (testimonialsSection) {
    const testimonialCards = testimonialsSection.querySelectorAll('.testimonial-card');
    const movingElements = testimonialsSection.querySelectorAll('.moving-element');
    
    // Scroll-triggered animations for testimonial cards
    function initTestimonialAnimations() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      }, {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
      });

      testimonialCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
      });
    }

    // Enhanced moving elements animation
    function enhanceMovingElements() {
      movingElements.forEach((element, index) => {
        // Add parallax effect on scroll
        element.addEventListener('mouseenter', () => {
          element.style.animationPlayState = 'paused';
        });
        
        element.addEventListener('mouseleave', () => {
          element.style.animationPlayState = 'running';
        });
      });
    }

    // Interactive testimonial cards
    function initInteractiveCards() {
      testimonialCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          card.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
          card.style.transform = 'translateY(0) scale(1)';
        });
      });
    }

    // Initialize testimonials functionality
    initTestimonialAnimations();
    enhanceMovingElements();
    initInteractiveCards();
  }
});



