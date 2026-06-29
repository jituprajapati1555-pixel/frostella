// About Page Specific Logic: Kinetic Headline, Scrubbed Timeline, Stats Counter, Lightbox gallery
document.addEventListener('DOMContentLoaded', () => {

  // 1. Kinetic Text Reveal on Load
  const aboutHeadline = document.getElementById('about-hero-headline');
  if (aboutHeadline) {
    const text = aboutHeadline.innerHTML.trim().replace(/<br\s*\/?>/g, ' <br> ');
    const words = text.split(/\s+/);
    aboutHeadline.innerHTML = '';
    
    words.forEach((word) => {
      if (word === '<br>') {
        aboutHeadline.appendChild(document.createElement('br'));
      } else {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'inline-block mr-2 select-none';
        
        const chars = word.split('');
        chars.forEach((char) => {
          const charSpan = document.createElement('span');
          charSpan.textContent = char;
          charSpan.className = 'about-char inline-block opacity-0 translate-y-12 rotate-[12deg]';
          wordSpan.appendChild(charSpan);
        });
        aboutHeadline.appendChild(wordSpan);
      }
    });

    gsap.to('.about-char', {
      opacity: 1,
      y: 0,
      rotation: 0,
      duration: 0.9,
      stagger: 0.02,
      ease: 'elastic.out(1.1, 0.75)',
      delay: 0.2
    });
  }

  // 2. Timeline Indicator Vertical Line Scrub
  const timelineIndicator = document.getElementById('timeline-indicator');
  if (timelineIndicator) {
    gsap.to(timelineIndicator, {
      height: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.timeline-row:first-child',
        start: 'top center',
        endTrigger: '.timeline-row:last-child',
        end: 'bottom center',
        scrub: true
      }
    });
  }

  // Highlight active timeline items as scroll passes
  const timelineRows = document.querySelectorAll('.timeline-row');
  timelineRows.forEach((row) => {
    const year = row.querySelector('.timeline-year');
    const dot = row.querySelector('.timeline-dot');

    gsap.timeline({
      scrollTrigger: {
        trigger: row,
        start: 'top 55%',
        end: 'bottom 45%',
        toggleActions: 'play reverse play reverse'
      }
    })
    .to(year, { color: '#FF3E6C', scale: 1.05, duration: 0.3 })
    .to(dot, { borderColor: '#FF3E6C', backgroundColor: '#FF3E6C', scale: 1.25, duration: 0.3 }, 0);
  });

  // 3. Stats Count-Up / Count-Down Animations
  const counters = document.querySelectorAll('.stat-counter');
  counters.forEach((counter) => {
    const target = parseInt(counter.dataset.target, 10);
    
    if (target === 0) {
      // Countdown for preservatives
      const countObj = { val: 100 };
      gsap.to(countObj, {
        val: 0,
        duration: 2.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: counter,
          start: 'top 90%'
        },
        onUpdate: () => {
          counter.textContent = `${Math.floor(countObj.val)}%`;
        }
      });
    } else {
      // Count-up for others
      const countObj = { val: 0 };
      gsap.to(countObj, {
        val: target,
        duration: 2.0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: counter,
          start: 'top 90%'
        },
        onUpdate: () => {
          if (target === 50 || target === 12) {
            counter.textContent = `${Math.floor(countObj.val)}+`;
          } else if (target === 100) {
            counter.textContent = `${Math.floor(countObj.val)}k+`;
          } else {
            counter.textContent = Math.floor(countObj.val);
          }
        }
      });
    }
  });

  // 4. Parlour Gallery Lightbox System
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxClose = document.getElementById('lightbox-close');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (lightbox && lightboxImg && lightboxClose && galleryItems.length > 0) {
    
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (!img) return;

        // Set lightbox image
        lightboxImg.src = img.src;

        // Fade in lightbox
        lightbox.classList.remove('pointer-events-none');
        gsap.to(lightbox, {
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out'
        });

        // Pause Lenis smooth scrolling
        if (window.lenis) {
          window.lenis.stop();
        }
      });
    });

    // Close lightbox handler
    const closeLightbox = () => {
      gsap.to(lightbox, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
        onComplete: () => {
          lightbox.classList.add('pointer-events-none');
          lightboxImg.src = ''; // reset
        }
      });

      // Resume scrolling
      if (window.lenis) {
        window.lenis.start();
      }
    };

    lightboxClose.addEventListener('click', closeLightbox);
    
    // Close on backdrop click (outside image)
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.id === 'lightbox-image') {
        closeLightbox();
      }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !lightbox.classList.contains('pointer-events-none')) {
        closeLightbox();
      }
    });
  }

  // Refresh cursor listeners for newly bound items
  if (window.initCursorHovers) {
    window.initCursorHovers();
  }
});
