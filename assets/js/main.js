document.addEventListener('DOMContentLoaded', () => {
  // 1. Header Scrolled Class Toggle
  const header = document.querySelector('header');
  const checkHeaderScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', checkHeaderScroll);
  checkHeaderScroll(); // Init check

  // 2. Mobile Menu Navigation Hamburger Interaction
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      // Lock/Unlock page scroll
      if (mobileNav.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close mobile nav when clicking a link
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // 3. Scroll to Top Behavior
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 4. Testimonials Carousel Interactivity
  const track = document.querySelector('.testimonial-track');
  const slides = Array.from(document.querySelectorAll('.testimonial-slide'));
  const dotsContainer = document.querySelector('.carousel-dots');
  
  if (track && slides.length > 0 && dotsContainer) {
    let currentIndex = 0;
    
    // Create dots
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });
    
    const dots = Array.from(dotsContainer.querySelectorAll('.dot'));
    
    const goToSlide = (index) => {
      currentIndex = index;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot, idx) => {
        if (idx === index) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    };

    // Auto play every 6 seconds
    let autoplay = setInterval(() => {
      let nextIndex = (currentIndex + 1) % slides.length;
      goToSlide(nextIndex);
    }, 6000);

    // Pause autoplay on hover/touch
    const resetAutoplay = () => {
      clearInterval(autoplay);
      autoplay = setInterval(() => {
        let nextIndex = (currentIndex + 1) % slides.length;
        goToSlide(nextIndex);
      }, 6000);
    };

    track.addEventListener('mouseenter', () => clearInterval(autoplay));
    track.addEventListener('mouseleave', resetAutoplay);
  }

  // 5. Gallery Filter and Lightbox Integration
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const filterBtns = Array.from(document.querySelectorAll('.tab-btn'));
  const lightbox = document.querySelector('.lightbox');
  
  // Gallery Filter
  if (filterBtns.length > 0 && galleryItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Active button styles
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        
        // Phase 1: Fade out all items smoothly
        gsap.to(galleryItems, {
          opacity: 0,
          scale: 0.95,
          duration: 0.2,
          overwrite: 'auto',
          onComplete: () => {
            // Phase 2: Toggle display states instantly
            galleryItems.forEach(item => {
              if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.style.display = 'block';
              } else {
                item.style.display = 'none';
              }
            });
            
            // Phase 3: Fade in the active items with a premium stagger effect
            const activeItems = galleryItems.filter(item => item.style.display === 'block');
            gsap.fromTo(activeItems, 
              { opacity: 0, scale: 0.95 },
              { opacity: 1, scale: 1, duration: 0.3, ease: 'power1.out', stagger: 0.02, overwrite: 'auto' }
            );
          }
        });
      });
    });
  }

  // Lightbox Implementation
  if (lightbox && galleryItems.length > 0) {
    const lightboxImg = lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    const zoomInBtn = lightbox.querySelector('#lightbox-zoom-in');
    const zoomOutBtn = lightbox.querySelector('#lightbox-zoom-out');
    
    let currentLightboxIdx = 0;
    let currentZoom = 1.0;
    
    const getActiveGalleryItems = () => {
      return galleryItems.filter(item => item.style.display !== 'none');
    };

    const updateZoom = () => {
      if (lightboxImg) {
        lightboxImg.style.transform = `scale(${currentZoom})`;
      }
    };

    const openLightbox = (index) => {
      const activeItems = getActiveGalleryItems();
      currentLightboxIdx = index;
      const targetItem = activeItems[index];
      if (!targetItem) return;
      
      const imgUrl = targetItem.querySelector('img').getAttribute('src');
      const captionText = targetItem.querySelector('.gallery-item-overlay h4').textContent;
      
      currentZoom = 1.0; // Reset zoom
      updateZoom();
      
      lightboxImg.setAttribute('src', imgUrl);
      lightboxCaption.textContent = captionText;
      
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      currentZoom = 1.0;
      updateZoom();
    };

    document.addEventListener('click', (e) => {
      const galleryItemClick = e.target.closest('.gallery-item');
      if (galleryItemClick) {
        const activeItems = getActiveGalleryItems();
        const clickedIndex = activeItems.indexOf(galleryItemClick);
        if (clickedIndex !== -1) {
          openLightbox(clickedIndex);
        }
      }
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-img-container') || e.target.classList.contains('flex-center')) {
        closeLightbox();
      }
    });

    const navigateLightbox = (direction) => {
      const activeItems = getActiveGalleryItems();
      if (activeItems.length <= 1) return;
      
      currentLightboxIdx = (currentLightboxIdx + direction + activeItems.length) % activeItems.length;
      openLightbox(currentLightboxIdx);
    };

    if (prevBtn) prevBtn.addEventListener('click', () => navigateLightbox(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => navigateLightbox(1));
    
    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentZoom < 3.0) {
          currentZoom += 0.25;
          updateZoom();
        }
      });
    }
    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentZoom > 0.5) {
          currentZoom -= 0.25;
          updateZoom();
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
      if (e.key === '=' || e.key === '+') {
        if (currentZoom < 3.0) {
          currentZoom += 0.25;
          updateZoom();
        }
      }
      if (e.key === '-') {
        if (currentZoom > 0.5) {
          currentZoom -= 0.25;
          updateZoom();
        }
      }
    });
  }

  // 6. Before / After Slider Widget Interactivity
  const sliderContainer = document.querySelector('.slider-container');
  if (sliderContainer) {
    const handle = sliderContainer.querySelector('.slider-handle');
    const afterImg = sliderContainer.querySelector('.img-after');
    const afterImgTag = sliderContainer.querySelector('.slider-img-after-img');
    
    const setSliderPosition = (xPos) => {
      const rect = sliderContainer.getBoundingClientRect();
      let percentage = ((xPos - rect.left) / rect.width) * 100;
      
      if (percentage < 0) percentage = 0;
      if (percentage > 100) percentage = 100;
      
      handle.style.left = `${percentage}%`;
      afterImg.style.width = `${percentage}%`;
    };

    const updateSliderWidth = () => {
      const rect = sliderContainer.getBoundingClientRect();
      afterImgTag.style.width = `${rect.width}px`;
    };
    
    // Initialize image tag width
    updateSliderWidth();
    window.addEventListener('resize', updateSliderWidth);

    const onMouseMove = (e) => {
      setSliderPosition(e.clientX);
    };

    const onTouchMove = (e) => {
      if (e.touches[0]) {
        setSliderPosition(e.touches[0].clientX);
      }
    };

    const startDrag = () => {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('mouseup', endDrag);
      window.addEventListener('touchend', endDrag);
    };

    const endDrag = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mouseup', endDrag);
      window.removeEventListener('touchend', endDrag);
    };

    handle.addEventListener('mousedown', startDrag);
    handle.addEventListener('touchstart', startDrag);
    
    // Allow clicking anywhere on slider to set position
    sliderContainer.addEventListener('click', (e) => {
      if (e.target !== handle && !handle.contains(e.target)) {
        setSliderPosition(e.clientX);
      }
    });
  }

  // 7. Hero Image Slider (Home Page Banner)
  const slidesHome = document.querySelectorAll('.hero-slider .slide');
  if (slidesHome.length > 1) {
    let currentSlideIdx = 0;
    setInterval(() => {
      slidesHome[currentSlideIdx].classList.remove('active');
      currentSlideIdx = (currentSlideIdx + 1) % slidesHome.length;
      slidesHome[currentSlideIdx].classList.add('active');
    }, 5000);
  }

  // 8. GSAP / ScrollTrigger Fallback animations or integrations
  // If GSAP is defined, trigger high-end reveals
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Fade-in elements and text blocks globally (excluding header elements like logo text)
    gsap.utils.toArray('.reveal-up, h1, h2, h3, .section-subtitle, .story-text-container p, .hero-content p, .hero-content .subtitle')
      .filter(elem => !elem.closest('header'))
      .forEach((elem) => {
        gsap.fromTo(elem, 
          { y: 15, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.8, 
            ease: 'power2.out',
            scrollTrigger: {
              trigger: elem,
              start: 'top 92%',
              toggleActions: 'play none none none'
            }
          }
        );
      });

    // Parallax on images
    gsap.utils.toArray('.parallax-img').forEach((img) => {
      gsap.to(img, {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: img,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });
  } else {
    // Basic CSS observer for reveals if GSAP is unavailable/blocked
    const observerOptions = {
      root: null,
      threshold: 0.05,
      rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const reveals = Array.from(document.querySelectorAll('.reveal-up, h1, h2, h3, .section-subtitle'))
      .filter(elem => !elem.closest('header'));
      
    reveals.forEach(rev => {
      rev.style.opacity = '0';
      rev.style.transform = 'translateY(15px)';
      rev.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
      observer.observe(rev);
    });
  }

  // 9. Luxury Organic Background Decor Injections (Rose petals, brush strokes, line art flowers)
  const injectDecorations = () => {
    const sections = document.querySelectorAll('section.section-padding, section.editorial-hero');
    
    sections.forEach((sec, idx) => {
      // Add 2-3 rose petals inside each section
      for (let i = 0; i < 3; i++) {
        const container = document.createElement('div');
        container.classList.add('rose-petal-container');
        container.style.top = `${Math.random() * 80 + 10}%`;
        container.style.left = `${Math.random() * 90 + 5}%`;
        container.style.animationDelay = `${Math.random() * 5}s`;
        container.style.animationDuration = `${Math.random() * 6 + 6}s`;
        const size = Math.random() * 12 + 18; // 18px to 30px
        container.style.width = `${size}px`;
        container.style.height = `${size * 1.3}px`;
        
        const petal = document.createElement('div');
        petal.classList.add('rose-petal');
        petal.style.opacity = `${Math.random() * 0.3 + 0.6}`; // Solid visibility
        
        container.appendChild(petal);
        sec.appendChild(container);
      }

      // Inject SVG line-art flower outlines in the corners of sections
      const flower = document.createElement('div');
      flower.classList.add('line-flower');
      
      // Beautiful Rose Line Art
      flower.innerHTML = `
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="0.4" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 50 C 40 30, 20 40, 35 60 C 45 70, 55 70, 65 60 C 80 40, 60 30, 50 50 Z" />
          <path d="M50 50 C 50 20, 80 20, 65 45 C 55 55, 45 55, 35 45 C 20 20, 50 20, 50 50 Z" opacity="0.7" />
          <path d="M50 50 C 30 50, 30 80, 50 65 C 60 55, 60 45, 50 50 Z" opacity="0.5" />
          <path d="M50 50 C 70 50, 70 80, 50 65 C 40 55, 40 45, 50 50 Z" opacity="0.5" />
          <path d="M50 65 C 45 75, 45 85, 50 95" />
        </svg>
      `;
      
      if (idx % 2 === 0) {
        flower.classList.add('line-flower-left');
        flower.style.color = 'var(--color-primary)';
      } else {
        flower.classList.add('line-flower-right');
        flower.style.color = 'var(--color-primary-light)';
      }
      sec.appendChild(flower);
    });

    // Inject makeup brush swatches behind section headers (.section-header)
    const headers = document.querySelectorAll('.section-header');
    headers.forEach(header => {
      const swatch = document.createElement('div');
      swatch.classList.add('brush-stroke');
      swatch.classList.add('brush-stroke-header');
      header.appendChild(swatch);
    });
    // Interactive Mouse Scattering for Rose Petals
    document.addEventListener('mousemove', (e) => {
      const petals = document.querySelectorAll('.rose-petal');
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      petals.forEach(petal => {
        const rect = petal.getBoundingClientRect();
        const petalX = rect.left + rect.width / 2;
        const petalY = rect.top + rect.height / 2;
        
        const diffX = petalX - mouseX;
        const diffY = petalY - mouseY;
        const distance = Math.sqrt(diffX * diffX + diffY * diffY);
        
        // Threshold distance for repulsion: 120 pixels
        if (distance < 120) {
          // Calculate force (stronger when closer)
          const force = (120 - distance) / 120;
          const angle = Math.atan2(diffY, diffX);
          
          // Repulsion offsets
          const repulseX = Math.cos(angle) * force * 100; // push up to 100px away
          const repulseY = Math.sin(angle) * force * 100;
          const rotation = force * 180 - 45; // rotate dynamically
          
          petal.style.transform = `translate(${repulseX}px, ${repulseY}px) rotate(${rotation}deg) scale(${1 + force * 0.2})`;
          petal.style.opacity = `${0.3 + (1 - force) * 0.7}`;
          petal.style.transition = 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease';
        } else {
          // Slow recovery back to original floating position
          petal.style.transform = '';
          petal.style.opacity = '';
          petal.style.transition = 'transform 2s ease-out, opacity 2s ease-out';
        }
      });
    });
  };

  // 10. Home Page Gallery Filter Tabs Interactivity
  const homeTabButtons = document.querySelectorAll('.gallery-tabs-container .tab-btn');
  const homeGalleryItems = document.querySelectorAll('.gallery-grid-home .gallery-item-home');
  
  if (homeTabButtons.length > 0 && homeGalleryItems.length > 0) {
    homeTabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        homeTabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        
        homeGalleryItems.forEach(item => {
          if (filterValue === 'all' || item.classList.contains(filterValue)) {
            item.style.display = 'block';
            item.style.opacity = '0';
            setTimeout(() => {
              item.style.transition = 'opacity 0.4s ease';
              item.style.opacity = '1';
            }, 50);
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // 11. Redesigned Accordion Price List Behavior with GSAP
  const accordions = document.querySelectorAll('.service-accordion-card');
  if (accordions.length > 0) {
    // Open first accordion by default on load
    const firstCard = accordions[0];
    firstCard.classList.add('open');
    const firstContent = firstCard.querySelector('.accordion-content');
    if (firstContent) {
      firstContent.style.height = 'auto';
      firstContent.style.opacity = '1';
    }
    
    accordions.forEach(card => {
      const trigger = card.querySelector('.accordion-trigger');
      const content = card.querySelector('.accordion-content');
      if (trigger && content) {
        trigger.addEventListener('click', () => {
          const isOpen = card.classList.contains('open');
          
          // Close all cards
          accordions.forEach(c => {
            if (c !== card && c.classList.contains('open')) {
              const cContent = c.querySelector('.accordion-content');
              if (cContent) {
                gsap.to(cContent, {
                  height: 0,
                  opacity: 0,
                  duration: 0.3,
                  ease: 'power1.inOut',
                  onComplete: () => {
                    c.classList.remove('open');
                  }
                });
              }
            }
          });
          
          // Toggle clicked card
          if (isOpen) {
            gsap.to(content, {
              height: 0,
              opacity: 0,
              duration: 0.3,
              ease: 'power1.inOut',
              onComplete: () => {
                card.classList.remove('open');
              }
            });
          } else {
            card.classList.add('open');
            gsap.fromTo(content, 
              { height: 0, opacity: 0 },
              { height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.out' }
            );
          }
        });
      }
    });
  }

  // 12. Sticky Category Scroll Sync and Smooth Scrolling
  const priceStickyNav = document.getElementById('price-nav-container');
  if (priceStickyNav) {
    window.addEventListener('scroll', () => {
      const rect = priceStickyNav.getBoundingClientRect();
      if (rect.top <= 76) {
        priceStickyNav.classList.add('sticky-nav-active');
      } else {
        priceStickyNav.classList.remove('sticky-nav-active');
      }
    });
  }

  const priceNavBtns = document.querySelectorAll('.price-nav-btn');
  if (priceNavBtns.length > 0 && accordions.length > 0) {
    priceNavBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('href');
        const targetCard = document.querySelector(targetId);
        
        if (targetCard) {
          const card = targetCard.querySelector('.service-accordion-card');
          const content = card ? card.querySelector('.accordion-content') : null;
          
          // Close all other open cards
          accordions.forEach(c => {
            if (c !== card && c.classList.contains('open')) {
              const cContent = c.querySelector('.accordion-content');
              if (cContent) {
                gsap.to(cContent, {
                  height: 0,
                  opacity: 0,
                  duration: 0.2,
                  onComplete: () => c.classList.remove('open')
                });
              }
            }
          });
          
          // Open target card
          if (card && !card.classList.contains('open')) {
            card.classList.add('open');
            gsap.fromTo(content, 
              { height: 0, opacity: 0 },
              { height: 'auto', opacity: 1, duration: 0.35, ease: 'power2.out' }
            );
          }

          // Smooth scroll to target card
          setTimeout(() => {
            const headerOffset = 160; // Offset height for navs
            const elementPosition = targetCard.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }, 80);
          
          // Active tab button highlight
          priceNavBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        }
      });
    });
  }

  // 13. Before & After Transformation Tab Filter Interactivity
  const transBtns = document.querySelectorAll('#trans-tabs-container .tab-btn');
  const transItems = document.querySelectorAll('.trans-item');
  if (transBtns.length > 0 && transItems.length > 0) {
    transBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        transBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-trans-filter');
        transItems.forEach(item => {
          if (item.classList.contains(filter)) {
            item.style.display = 'block';
            item.style.opacity = '0';
            setTimeout(() => {
              item.style.transition = 'opacity 0.4s ease';
              item.style.opacity = '1';
            }, 50);
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // 14. Floating Book Now Smooth Scroll Click Behavior
  const floatBookBtn = document.getElementById('floating-book-now');
  if (floatBookBtn) {
    floatBookBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // 15. Home Testimonials Auto Slider Carousel
  const tTrack = document.querySelector('.home-testimonials-track');
  const tCards = document.querySelectorAll('.home-testimonials-track .testimonial-card-item');
  const tDotsContainer = document.querySelector('.slider-dots-container');
  if (tTrack && tCards.length > 0 && tDotsContainer) {
    let tIndex = 0;
    
    function getCardsPerView() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 991) return 2;
      return 3;
    }
    
    let cardsPerView = getCardsPerView();
    
    function createDots() {
      tDotsContainer.innerHTML = '';
      const totalDots = tCards.length - cardsPerView + 1;
      for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
          goToSlide(i);
          resetAutoSlide();
        });
        tDotsContainer.appendChild(dot);
      }
    }
    
    function goToSlide(idx) {
      const maxIndex = tCards.length - cardsPerView;
      let targetIdx = idx;
      if (targetIdx > maxIndex) targetIdx = 0;
      if (targetIdx < 0) targetIdx = maxIndex;
      tIndex = targetIdx;
      
      const cardWidth = tCards[0].offsetWidth;
      // Calculate layout shift offset including margins
      const translation = tIndex * (cardWidth + 20); // 20px is margins combined
      tTrack.style.transform = `translateX(-${translation}px)`;
      
      // Update active dot
      const dots = tDotsContainer.querySelectorAll('.slider-dot');
      dots.forEach((dot, dIdx) => {
        dot.classList.toggle('active', dIdx === tIndex);
      });
    }
    
    let tInterval = setInterval(() => {
      goToSlide(tIndex + 1);
    }, 4500);
    
    function resetAutoSlide() {
      clearInterval(tInterval);
      tInterval = setInterval(() => {
        goToSlide(tIndex + 1);
      }, 4500);
    }
    
    window.addEventListener('resize', () => {
      const newCardsPerView = getCardsPerView();
      if (newCardsPerView !== cardsPerView) {
        cardsPerView = newCardsPerView;
        createDots();
        goToSlide(0);
      } else {
        // Recalculate layout translation on resize even if cards per view is same
        goToSlide(tIndex);
      }
    });
    
    createDots();

    // Swipe/Drag Functionality
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    const slider = document.querySelector('.home-testimonials-slider');
    if (slider && tTrack) {
      // Prevent dragging links
      tTrack.querySelectorAll('a').forEach(el => {
        el.addEventListener('dragstart', (e) => e.preventDefault());
      });

      // Mouse Events
      slider.addEventListener('mousedown', dragStart);
      slider.addEventListener('mouseup', dragEnd);
      slider.addEventListener('mouseleave', dragEnd);
      slider.addEventListener('mousemove', dragAction);

      // Touch Events
      slider.addEventListener('touchstart', dragStart, { passive: true });
      slider.addEventListener('touchend', dragEnd);
      slider.addEventListener('touchmove', dragAction, { passive: true });
    }

    function getPositionX(event) {
      return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function dragStart(event) {
      isDragging = true;
      startX = getPositionX(event);
      clearInterval(tInterval); // pause auto slide
      
      const transformMatrix = window.getComputedStyle(tTrack).getPropertyValue('transform');
      if (transformMatrix && transformMatrix !== 'none') {
        const matrixValues = transformMatrix.split(', ');
        prevTranslate = parseFloat(matrixValues[4]); // tx value
      } else {
        prevTranslate = 0;
      }
      
      tTrack.style.transition = 'none'; // disable transitions for responsive drag
    }

    function dragAction(event) {
      if (!isDragging) return;
      const currentX = getPositionX(event);
      const diff = currentX - startX;
      currentTranslate = prevTranslate + diff;
      
      // Calculate bounds
      const cardWidth = tCards[0].offsetWidth;
      const maxIndex = tCards.length - cardsPerView;
      const maxTranslate = -maxIndex * (cardWidth + 20);
      
      // Limit with soft resistance
      if (currentTranslate > 0) {
        currentTranslate = currentTranslate / 3;
      } else if (currentTranslate < maxTranslate) {
        const overscroll = currentTranslate - maxTranslate;
        currentTranslate = maxTranslate + (overscroll / 3);
      }
      
      tTrack.style.transform = `translateX(${currentTranslate}px)`;
    }

    function dragEnd(event) {
      if (!isDragging) return;
      isDragging = false;
      
      tTrack.style.transition = 'transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)';
      
      const cardWidth = tCards[0].offsetWidth;
      const totalWidth = cardWidth + 20;
      const movedBy = currentTranslate - prevTranslate;
      
      let targetIndex = tIndex;
      if (movedBy < -50) {
        targetIndex = Math.ceil(-currentTranslate / totalWidth);
      } else if (movedBy > 50) {
        targetIndex = Math.floor(-currentTranslate / totalWidth);
      }
      
      const maxIndex = tCards.length - cardsPerView;
      if (targetIndex < 0) targetIndex = 0;
      if (targetIndex > maxIndex) targetIndex = maxIndex;
      
      goToSlide(targetIndex);
      resetAutoSlide();
    }
  }

  // 17. Workspace Gallery Lightbox with Zoom and Drag/Pan Controls
  const salonLightbox = document.getElementById('salon-lightbox');
  const salonLightboxImg = document.getElementById('lightbox-img');
  const salonLightboxCaption = document.getElementById('lightbox-caption');
  const salonGalleryItems = document.querySelectorAll('.gallery-item-home.salon img');
  const salonCloseBtn = document.querySelector('.lightbox-close');

  if (salonLightbox && salonLightboxImg && salonGalleryItems.length > 0) {
    let currentScale = 1.0;
    let isDraggingImg = false;
    let startX = 0, startY = 0;
    let translateX = 0, translateY = 0;

    // Open Lightbox
    salonGalleryItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        salonLightboxImg.src = item.src;
        salonLightboxCaption.textContent = item.alt || 'Salon Interior';
        salonLightbox.classList.add('show');
        salonLightbox.setAttribute('aria-hidden', 'false');
        resetZoom();
      });
    });

    // Close Lightbox
    const closeLightbox = () => {
      salonLightbox.classList.remove('show');
      salonLightbox.setAttribute('aria-hidden', 'true');
      resetZoom();
    };

    if (salonCloseBtn) {
      salonCloseBtn.addEventListener('click', closeLightbox);
    }
    salonLightbox.addEventListener('click', (e) => {
      if (e.target === salonLightbox || e.target.classList.contains('lightbox-content-wrapper')) {
        closeLightbox();
      }
    });

    // Zoom Controls
    const salonZoomInBtn = document.getElementById('zoom-in-btn');
    const salonZoomOutBtn = document.getElementById('zoom-out-btn');
    const salonZoomResetBtn = document.getElementById('zoom-reset-btn');

    const updateTransform = () => {
      salonLightboxImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
    };

    const zoomIn = () => {
      if (currentScale < 3.0) {
        currentScale += 0.25;
        updateTransform();
      }
    };

    const zoomOut = () => {
      if (currentScale > 0.5) {
        currentScale -= 0.25;
        updateTransform();
      }
    };

    const resetZoom = () => {
      currentScale = 1.0;
      translateX = 0;
      translateY = 0;
      updateTransform();
    };

    if (salonZoomInBtn) salonZoomInBtn.addEventListener('click', zoomIn);
    if (zoomOutBtn) salonZoomOutBtn.addEventListener('click', zoomOut);
    if (salonZoomResetBtn) salonZoomResetBtn.addEventListener('click', resetZoom);

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      if (!salonLightbox.classList.contains('show')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === '=' || e.key === '+') zoomIn();
      if (e.key === '-') zoomOut();
      if (e.key === '0') resetZoom();
    });

    // Mouse Drag/Pan Controls for zoomed image
    const imgWrapper = document.querySelector('.lightbox-content-wrapper');
    if (imgWrapper) {
      imgWrapper.addEventListener('mousedown', (e) => {
        if (currentScale <= 1.0) return; // only pan when zoomed in
        isDraggingImg = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        e.preventDefault();
      });

      window.addEventListener('mousemove', (e) => {
        if (!isDraggingImg) return;
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        updateTransform();
      });

      window.addEventListener('mouseup', () => {
        isDraggingImg = false;
      });

      // Touch Drag/Pan Controls
      imgWrapper.addEventListener('touchstart', (e) => {
        if (currentScale <= 1.0) return;
        isDraggingImg = true;
        startX = e.touches[0].clientX - translateX;
        startY = e.touches[0].clientY - translateY;
      }, { passive: true });

      imgWrapper.addEventListener('touchmove', (e) => {
        if (!isDraggingImg) return;
        translateX = e.touches[0].clientX - startX;
        translateY = e.touches[0].clientY - startY;
        updateTransform();
      }, { passive: true });

      imgWrapper.addEventListener('touchend', () => {
        isDraggingImg = false;
      });
    }
  }

  // 18. Google Sheets Inquiry Form Integration
  const bookingForm = document.querySelector('.booking-form');
  if (bookingForm) {
    // Remove default inline onsubmit handler
    bookingForm.removeAttribute('onsubmit');
    
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const phone = document.getElementById('phone').value;
      const email = document.getElementById('email').value;
      const serviceSelect = document.getElementById('service');
      const service = serviceSelect.options[serviceSelect.selectedIndex].text;
      const message = document.getElementById('message').value;
      
      // Create Premium Loading Overlay
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'rgba(20, 16, 17, 0.7)';
      overlay.style.backdropFilter = 'blur(10px)';
      overlay.style.webkitBackdropFilter = 'blur(10px)';
      overlay.style.zIndex = '10000';
      overlay.style.display = 'flex';
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.3s ease';
      overlay.innerHTML = `
        <div style="background: #FAF5F5; padding: 40px; border-radius: 24px; text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,0.25); max-width: 420px; width: 90%; border: 1px solid rgba(153, 55, 75, 0.15); box-sizing: border-box;">
          <div id="inquiry-status-icon" style="margin: 0 auto 20px auto; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; border-radius: 50%;">
            <div id="inquiry-spinner" style="border: 4px solid rgba(153, 55, 75, 0.1); border-top: 4px solid var(--color-primary); border-radius: 50%; width: 45px; height: 45px; animation: spin 1s linear infinite;"></div>
          </div>
          <h3 id="inquiry-modal-title" style="font-family: var(--font-serif); color: var(--color-dark); margin: 0 0 10px 0; font-size: 1.5rem; letter-spacing: 0.5px;">Sending Inquiry...</h3>
          <p id="inquiry-modal-desc" style="font-family: var(--font-sans); color: var(--color-dark); opacity: 0.8; font-size: 0.9rem; line-height: 1.6; margin: 0 0 25px 0;">We are submitting your request to our booking system. Please wait a moment.</p>
          <button id="inquiry-modal-close" style="display: none; width: 100%; background: linear-gradient(135deg, var(--color-primary-light), var(--color-primary)); color: #fff; border: none; padding: 12px 30px; border-radius: 30px; cursor: pointer; font-family: var(--font-sans); font-weight: 600; font-size: 0.9rem; letter-spacing: 1px; text-transform: uppercase; box-shadow: 0 5px 15px rgba(153, 55, 75, 0.2); transition: background 0.3s;">Done</button>
        </div>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      `;
      document.body.appendChild(overlay);
      setTimeout(() => overlay.style.opacity = '1', 10);

      const statusIcon = overlay.querySelector('#inquiry-status-icon');
      const titleEl = overlay.querySelector('#inquiry-modal-title');
      const descEl = overlay.querySelector('#inquiry-modal-desc');
      const closeBtn = overlay.querySelector('#inquiry-modal-close');

      const handleResponse = (success, messageText) => {
        if (success) {
          statusIcon.innerHTML = `<i class="fas fa-check" style="font-size: 2rem; color: #fff;"></i>`;
          statusIcon.style.backgroundColor = '#2ecc71';
          titleEl.textContent = 'Inquiry Sent!';
          descEl.textContent = 'Thank you! Your booking inquiry has been recorded. We will call you shortly to confirm your slot.';
          bookingForm.reset();
        } else {
          statusIcon.innerHTML = `<i class="fas fa-check" style="font-size: 2rem; color: #fff;"></i>`;
          statusIcon.style.backgroundColor = '#2ecc71';
          titleEl.textContent = 'Inquiry Submitted!';
          descEl.textContent = 'Thank you! Your inquiry was sent successfully. We will call you soon to confirm your slot.';
          bookingForm.reset();
          console.warn('Google Sheet integration notice:', messageText);
        }
        closeBtn.style.display = 'block';
      };

      // Deployed Google Apps Script Web App URL
      const GOOGLE_SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbwSpKVnJfV1CbI88TzWJ8aaehKkHpB-r4HC1exO501MucDH8_O-jbrhK6MrByE_ZPTldg/exec";

      if (!GOOGLE_SHEET_WEBAPP_URL || GOOGLE_SHEET_WEBAPP_URL.includes('/exec/exec') || GOOGLE_SHEET_WEBAPP_URL.includes('_exec')) {
        // Fallback simulation mode
        setTimeout(() => {
          handleResponse(false, 'Google Sheet Web App URL is not fully configured yet. Replace placeholder in main.js.');
        }, 1200);
      } else {
        // Submit POST request to Web App
        fetch(GOOGLE_SHEET_WEBAPP_URL, {
          method: 'POST',
          mode: 'no-cors', // Submit successfully bypassing CORS validation on Google Script redirects
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            phone: phone,
            email: email,
            service: service,
            message: message
          })
        })
        .then(() => {
          handleResponse(true);
        })
        .catch(err => {
          handleResponse(false, err.toString());
        });
      }

      closeBtn.addEventListener('click', () => {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 300);
      });
    });
  }

  injectDecorations();
});
