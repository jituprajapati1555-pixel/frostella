// Global Javascript Setup: Lenis Scroll, Custom Gooey Cursor, Global Hooks
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lenis Smooth Scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 2.0,
    infinite: false,
  });

  // RAF loop for Lenis
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Sync scroll animations with ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Expose lenis globally for other scripts
  window.lenis = lenis;

  // 2. Custom Gooey Cursor with Drip Trail
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorContainer = document.querySelector('.custom-cursor-container');
  
  if (cursorDot && cursorContainer) {
    let lastX = window.innerWidth / 2;
    let lastY = window.innerHeight / 2;
    let targetX = lastX;
    let targetY = lastY;
    let speed = 0.15; // Interpolation factor

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });

    // Update cursor position smoothly
    function updateCursor() {
      lastX += (targetX - lastX) * speed;
      lastY += (targetY - lastY) * speed;

      cursorDot.style.left = `${lastX}px`;
      cursorDot.style.top = `${lastY}px`;

      // Spawn dripping trail if moving fast enough
      const dist = Math.hypot(targetX - lastX, targetY - lastY);
      if (dist > 8 && Math.random() < 0.3) {
        spawnDrip(lastX, lastY);
      }

      requestAnimationFrame(updateCursor);
    }
    requestAnimationFrame(updateCursor);

    // Spawn melting drip particles
    function spawnDrip(x, y) {
      const drip = document.createElement('div');
      drip.className = 'cursor-trail-drop';
      
      // Randomize sizes slightly
      const size = Math.random() * 8 + 6;
      drip.style.width = `${size}px`;
      drip.style.height = `${size}px`;
      drip.style.left = `${x}px`;
      drip.style.top = `${y}px`;

      // Set random directional variables for CSS drop movement
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 15 + 10;
      drip.style.setProperty('--fall-x', `${Math.cos(angle) * distance}px`);
      drip.style.setProperty('--fall-y', `${Math.random() * 25 + 30}px`);
      drip.style.setProperty('--fall-rotate', `${Math.random() * 360}deg`);

      // Make trails match hovering style
      if (cursorDot.classList.contains('hovered')) {
        drip.classList.add('hovered');
      }

      cursorContainer.appendChild(drip);
      setTimeout(() => drip.remove(), 600);
    }

    // Add Hover Listeners for Interactive Elements
    window.initCursorHovers = function() {
      const hoverables = document.querySelectorAll('a, button, select, input, textarea, label, [role="button"], .hover-trigger');
      hoverables.forEach(el => {
        // Prevent duplicate bindings
        if (el.dataset.cursorBound) return;
        el.dataset.cursorBound = "true";

        el.addEventListener('mouseenter', () => {
          cursorDot.classList.add('hovered');
          if (el.dataset.cursorText) {
            cursorDot.textContent = el.dataset.cursorText;
            cursorDot.classList.add('accent-hover');
          }
        });

        el.addEventListener('mouseleave', () => {
          cursorDot.classList.remove('hovered', 'accent-hover');
          cursorDot.textContent = '';
        });
      });
    };

    // Run initial hook
    window.initCursorHovers();
  }

  // 3. Mobile Navbar Interaction
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuLines = document.querySelectorAll('.menu-line');

  if (menuBtn && mobileMenu) {
    let menuOpen = false;

    menuBtn.addEventListener('click', () => {
      menuOpen = !menuOpen;
      
      if (menuOpen) {
        // Open animation
        gsap.to(mobileMenu, { 
          y: 0, 
          opacity: 1, 
          duration: 0.6, 
          ease: 'power4.out',
          pointerEvents: 'auto'
        });
        // Animate burger lines to "X"
        gsap.to(menuLines[0], { y: 6, rotation: 45, duration: 0.3 });
        gsap.to(menuLines[1], { opacity: 0, duration: 0.2 });
        gsap.to(menuLines[2], { y: -6, rotation: -45, duration: 0.3 });
        
        // Temporarily stop scrolling
        lenis.stop();
      } else {
        // Close animation
        gsap.to(mobileMenu, { 
          y: '-100%', 
          opacity: 0, 
          duration: 0.5, 
          ease: 'power3.inOut',
          pointerEvents: 'none'
        });
        // Restore burger lines
        gsap.to(menuLines[0], { y: 0, rotation: 0, duration: 0.3 });
        gsap.to(menuLines[1], { opacity: 1, duration: 0.2 });
        gsap.to(menuLines[2], { y: 0, rotation: 0, duration: 0.3 });
        
        // Restore scrolling
        lenis.start();
      }
    });

    // Close menu when clicking nav link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (!menuOpen) return;
        menuOpen = false;
        gsap.to(mobileMenu, { y: '-100%', opacity: 0, duration: 0.5, ease: 'power3.inOut', pointerEvents: 'none' });
        gsap.to(menuLines[0], { y: 0, rotation: 0, duration: 0.3 });
        gsap.to(menuLines[1], { opacity: 1, duration: 0.2 });
        gsap.to(menuLines[2], { y: 0, rotation: 0, duration: 0.3 });
        lenis.start();
      });
    });
  }

  // 4. Global Scroll Reveal animations
  gsap.registerPlugin(ScrollTrigger);
  
  const revealElements = document.querySelectorAll('.reveal-item');
  revealElements.forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1.0,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });
  });
});
