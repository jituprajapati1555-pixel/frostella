// Homepage Specific Logic: Hero, Bento hover particles, Build Scoop Widget, Scrollytelling, Reserve sparkles
document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Kinetic Text Reveal on Load
  const headline = document.getElementById('hero-headline');
  if (headline) {
    const text = headline.innerHTML.trim().replace(/<br\s*\/?>/g, ' <br> ');
    const words = text.split(/\s+/);
    headline.innerHTML = '';
    
    words.forEach((word) => {
      if (word === '<br>') {
        headline.appendChild(document.createElement('br'));
      } else {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'inline-block mr-2 select-none';
        
        const chars = word.split('');
        chars.forEach((char) => {
          const charSpan = document.createElement('span');
          charSpan.textContent = char;
          charSpan.className = 'hero-char inline-block opacity-0 translate-y-12 rotate-[15deg]';
          wordSpan.appendChild(charSpan);
        });
        headline.appendChild(wordSpan);
      }
    });

    gsap.to('.hero-char', {
      opacity: 1,
      y: 0,
      rotation: 0,
      duration: 1.0,
      stagger: 0.025,
      ease: 'elastic.out(1.1, 0.75)',
      delay: 0.3
    });
  }

  // 1.5. Fallback gradients for broken bento grid images
  const bentoImages = document.querySelectorAll('.bento-card img');
  bentoImages.forEach(img => {
    img.addEventListener('error', () => {
      const card = img.closest('.bento-card');
      if (!card) return;
      const flavour = card.dataset.flavour;
      let fallbackBg = 'linear-gradient(135deg, #FAF6F0, #FCEBF3)';
      if (flavour === 'chocolate') fallbackBg = 'linear-gradient(135deg, #2A1A17, #5C3A21)';
      else if (flavour === 'strawberry') fallbackBg = 'linear-gradient(135deg, #FCEBF3, #FF7597)';
      else if (flavour === 'pistachio') fallbackBg = 'linear-gradient(135deg, #EBF5EE, #A4D4B4)';
      else if (flavour === 'cookies') fallbackBg = 'linear-gradient(135deg, #FAF6F0, #4A3B32)';
      else if (flavour === 'mango') fallbackBg = 'linear-gradient(135deg, #FCF2D9, #FFAA00)';

      img.style.display = 'none';
      const container = img.parentElement;
      container.style.background = fallbackBg;
      container.style.opacity = '0.85';
    });
    // Trigger check immediately in case image loaded before script execution
    if (img.complete && img.naturalWidth === 0) {
      img.dispatchEvent(new Event('error'));
    }
  });

  // 2. Hero Scroll Scrub clip-path morph
  gsap.to('.hero-image-wrapper', {
    clipPath: 'inset(0% 0% 0% 0% round 0px)',
    scale: 1.15,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero-section',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  // 3. Bento Grid Hover Particle Splash
  const bentoCards = document.querySelectorAll('.bento-card');
  bentoCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      // Limit particle frequency
      if (Math.random() > 0.08) return;
      
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const flavour = card.dataset.flavour;
      let char = '✨';
      let color = '#FF3E6C';

      switch (flavour) {
        case 'chocolate':
          char = '🍫';
          color = '#5C3A21';
          break;
        case 'strawberry':
          char = '🍓';
          color = '#FF7597';
          break;
        case 'pistachio':
          char = '🍃';
          color = '#A4D4B4';
          break;
        case 'cookies':
          char = '🍪';
          color = '#4A3B32';
          break;
        case 'mango':
          char = '🥭';
          color = '#FFAA00';
          break;
      }

      const p = document.createElement('span');
      p.textContent = char;
      p.className = 'absolute pointer-events-none select-none text-xl z-20';
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      
      card.appendChild(p);

      gsap.to(p, {
        y: '-=60',
        x: `+=${(Math.random() - 0.5) * 50}`,
        opacity: 0,
        scale: 1.5,
        rotation: Math.random() * 360,
        duration: 0.9,
        ease: 'power3.out',
        onComplete: () => p.remove()
      });
    });
  });

  // 4. "Build Your Scoop" Widget Implementation
  const state = {
    flavour: null,
    topping: null,
    sauce: null,
    step: 1
  };

  // Upgraded Premium Visual Scoop Elements
  const nextBtn = document.getElementById('widget-next-btn');
  const backBtn = document.getElementById('widget-back-btn');
  const visualScoopContainer = document.getElementById('visual-scoop-container');
  const scoopLayer1 = document.getElementById('scoop-layer-1');
  const scoopLayer2 = document.getElementById('scoop-layer-2');
  const visualToppingLayer = document.getElementById('visual-topping-layer');
  const visualSauceLayer = document.getElementById('visual-sauce-layer');
  
  let currentScoopLayer = 1; // Tracks crossfades between layer 1 and 2

  // Subtle slow infinite wobble timeline to make it feel alive
  const wobbleTimeline = gsap.timeline({ repeat: -1, yoyo: true });
  wobbleTimeline.to(visualScoopContainer, {
    rotation: 1.8,
    scaleX: 1.015,
    scaleY: 0.985,
    y: '+=3.5',
    duration: 3.5,
    ease: 'sine.inOut'
  });

  const stepBars = [
    document.getElementById('step-1-bar'),
    document.getElementById('step-2-bar'),
    document.getElementById('step-3-bar')
  ];

  const stages = [
    document.getElementById('widget-stage-1'),
    document.getElementById('widget-stage-2'),
    document.getElementById('widget-stage-3'),
    document.getElementById('widget-result')
  ];

  // Flavour Buttons: crossfading premium 3D gradients
  const flavourBtns = document.querySelectorAll('.flavour-select-btn');
  flavourBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      flavourBtns.forEach(b => b.classList.remove('border-accent', 'bg-pink/30'));
      btn.classList.add('border-accent', 'bg-pink/30');

      state.flavour = {
        colorLight: btn.dataset.colorLight,
        colorBase: btn.dataset.colorBase,
        colorDark: btn.dataset.colorDark,
        label: btn.dataset.label,
        vibe: btn.dataset.vibe
      };

      // Determine active and passive layers for crossfade transition
      const activeLayer = currentScoopLayer === 1 ? scoopLayer1 : scoopLayer2;
      const targetLayer = currentScoopLayer === 1 ? scoopLayer2 : scoopLayer1;

      // Apply radial gradient style to target layer
      targetLayer.style.background = `radial-gradient(circle at 35% 35%, ${state.flavour.colorLight} 0%, ${state.flavour.colorBase} 60%, ${state.flavour.colorDark} 100%)`;

      // Animate crossfade color transition
      gsap.to(activeLayer, { opacity: 0, duration: 0.4, ease: 'power2.out' });
      gsap.to(targetLayer, { opacity: 1, duration: 0.4, ease: 'power2.out' });

      // If scoop is not yet visible, animate container falling with bounce
      if (gsap.getProperty(visualScoopContainer, "scale") === 0) {
        gsap.fromTo(visualScoopContainer, 
          { y: -300, scale: 0 }, 
          { y: 0, scale: 1, duration: 1.0, ease: 'bounce.out' }
        );
      }

      // Flip tracker flag
      currentScoopLayer = currentScoopLayer === 1 ? 2 : 1;

      enableNext();
    });
  });

  // Topping Buttons: spawning physical particles resting mathematically on top curve
  const toppingBtns = document.querySelectorAll('.topping-select-btn');
  toppingBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toppingBtns.forEach(b => b.classList.remove('border-accent', 'bg-pink/30'));
      btn.classList.add('border-accent', 'bg-pink/30');

      state.topping = {
        type: btn.dataset.type,
        label: btn.dataset.label
      };

      // Spawn toppings visual effect with circle math
      spawnToppingsEffect(state.topping.type);
      enableNext();
    });
  });

  // Sauce Buttons: layered dripper sliding down inside masked scoop shape
  const sauceBtns = document.querySelectorAll('.sauce-select-btn');
  sauceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sauceBtns.forEach(b => b.classList.remove('border-accent', 'bg-pink/30'));
      btn.classList.add('border-accent', 'bg-pink/30');

      state.sauce = {
        color: btn.dataset.color,
        label: btn.dataset.label
      };

      // Animate sauce layer dripping down
      if (state.sauce.color !== 'transparent') {
        visualSauceLayer.style.color = state.sauce.color;
        gsap.fromTo(visualSauceLayer, 
          { opacity: 0, scaleY: 0, y: -20 }, 
          { opacity: 1, scaleY: 1, y: 0, duration: 0.7, ease: 'bounce.out' }
        );
      } else {
        gsap.to(visualSauceLayer, { opacity: 0, scaleY: 0, duration: 0.3 });
      }

      enableNext();
    });
  });

  function enableNext() {
    nextBtn.removeAttribute('disabled');
    nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
  }

  function disableNext() {
    nextBtn.setAttribute('disabled', 'true');
    nextBtn.classList.add('opacity-50', 'cursor-not-allowed');
  }

  // Topping particle builder using circle equation: (x-cx)^2 + (y-cy)^2 = R^2
  function spawnToppingsEffect(type) {
    visualToppingLayer.innerHTML = '';
    if (type === 'none') return;

    const R = 68; // Radius of visual scoop boundary inside container
    const cx = 75; // Center x
    const cy = 75; // Center y

    for (let i = 0; i < 20; i++) {
      const p = document.createElement('span');
      p.className = 'absolute pointer-events-none';
      
      // Calculate coordinates to align particles along the top curvature of the scoop
      const px = Math.random() * (R * 1.4) + (cx - R * 0.7);
      const dx = px - cx;
      const py = cy - Math.sqrt(Math.max(0, R*R - dx*dx)) + (Math.random() * 12 - 4); // add minor vertical offset dispersion
      
      p.style.left = `${px}px`;
      p.style.top = `${py}px`;
      
      if (type === 'sprinkles') {
        p.style.width = '4px';
        p.style.height = '10px';
        p.style.borderRadius = '5px';
        const sprColors = ['#FF3E6C', '#FFD700', '#00FFFF', '#FF00FF', '#7FFF00', '#FFA500'];
        p.style.backgroundColor = sprColors[Math.floor(Math.random() * sprColors.length)];
        p.style.transform = `rotate(${Math.random() * 360}deg) scale(0)`;
      } else if (type === 'chips') {
        p.style.width = '7px';
        p.style.height = '7px';
        p.style.borderRadius = '35% 65% 55% 45%';
        p.style.backgroundColor = '#382015';
        p.style.transform = `rotate(${Math.random() * 360}deg) scale(0)`;
      } else if (type === 'berries') {
        p.style.width = '12px';
        p.style.height = '12px';
        p.style.borderRadius = '50%';
        p.style.backgroundColor = '#D01C1C';
        p.style.transform = 'scale(0)';
        // Shiny highlight inside berry
        p.innerHTML = '<div class="absolute top-[2px] left-[2px] w-[3px] h-[3px] rounded-full bg-white/40"></div>';
      }

      visualToppingLayer.appendChild(p);

      // Bounce fall-in animation landing on curvature
      gsap.fromTo(p,
        { y: py - 40, opacity: 0, scale: 0 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, delay: i * 0.02, ease: 'bounce.out' }
      );
    }
  }

  // Next and Back navigation triggers
  nextBtn.addEventListener('click', () => {
    if (state.step < 3) {
      goToStep(state.step + 1);
    } else if (state.step === 3) {
      showResultCard();
    }
  });

  backBtn.addEventListener('click', () => {
    if (state.step > 1) {
      goToStep(state.step - 1);
    }
  });

  function goToStep(targetStep) {
    // Hide current stage
    stages[state.step - 1].classList.add('hidden');
    
    state.step = targetStep;

    // Show new stage
    stages[state.step - 1].classList.remove('hidden');

    // Update Progress Bars
    stepBars.forEach((bar, index) => {
      if (index < state.step) {
        bar.classList.replace('bg-cocoa/10', 'bg-accent');
      } else {
        bar.classList.replace('bg-accent', 'bg-cocoa/10');
      }
    });

    // Toggle Back button accessibility
    if (state.step > 1) {
      backBtn.removeAttribute('disabled');
      backBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
      backBtn.setAttribute('disabled', 'true');
      backBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }

    // Toggle next button label and state
    if (state.step === 3) {
      nextBtn.textContent = 'Reveal Recipe';
    } else {
      nextBtn.textContent = 'Next Step';
    }

    // Check if next option is already chosen (to keep button enabled on backward navigation)
    let selectedOption = false;
    if (state.step === 1 && state.flavour) selectedOption = true;
    if (state.step === 2 && state.topping) selectedOption = true;
    if (state.step === 3 && state.sauce) selectedOption = true;

    if (selectedOption) {
      enableNext();
    } else {
      disableNext();
    }
  }

  function showResultCard() {
    // Hide stage 3 and controls layout
    stages[2].classList.add('hidden');
    document.getElementById('widget-nav-group').classList.add('hidden');
    
    // Set up results copy details
    const profileName = document.getElementById('result-profile-name');
    const resultDesc = document.getElementById('result-description');

    const flavorName = state.flavour ? state.flavour.label : 'Gourmet Cream';
    const toppingName = (state.topping && state.topping.type !== 'none') ? state.topping.label : 'Pure Scoops';
    const sauceName = (state.sauce && state.sauce.color !== 'transparent') ? state.sauce.label : 'Clean Finish';
    const vibeName = state.flavour ? state.flavour.vibe : 'Ice Cream Lover';

    profileName.textContent = `${vibeName} Scoop 🍦`;
    resultDesc.textContent = `A customized ${flavorName} scoop, piled with ${toppingName} and finished with a rich drizzle of ${sauceName}.`;

    // Show results stage
    stages[3].classList.remove('hidden');
    gsap.fromTo(stages[3], 
      { scale: 0.9, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.5)' }
    );
  }

  // Copy Recipe Event
  const copyBtn = document.getElementById('copy-vibe-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const flavorName = state.flavour ? state.flavour.label : 'Gourmet Cream';
      const toppingName = (state.topping && state.topping.type !== 'none') ? state.topping.label : 'Pure Scoops';
      const sauceName = (state.sauce && state.sauce.color !== 'transparent') ? state.sauce.label : 'Clean Finish';
      
      const copyText = `I just mixed my dream scoop at Frostella: ${flavorName} with ${toppingName} & ${sauceName}! 🍦✨ Mix yours here!`;
      
      navigator.clipboard.writeText(copyText).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Recipe Copied! ✓';
        copyBtn.classList.add('bg-cocoa', 'text-cream');
        
        setTimeout(() => {
          copyBtn.textContent = originalText;
          copyBtn.classList.remove('bg-cocoa', 'text-cream');
        }, 2000);
      });
    });
  }

  // Reset Widget Event
  const resetBtn = document.getElementById('reset-vibe-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      // Clear selections and states
      state.flavour = null;
      state.topping = null;
      state.sauce = null;
      state.step = 1;

      flavourBtns.forEach(b => b.classList.remove('border-accent', 'bg-pink/30'));
      toppingBtns.forEach(b => b.classList.remove('border-accent', 'bg-pink/30'));
      sauceBtns.forEach(b => b.classList.remove('border-accent', 'bg-pink/30'));

      // Hide results container and restore controls layout
      stages[3].classList.add('hidden');
      document.getElementById('widget-nav-group').classList.remove('hidden');

      // Clear graphics
      gsap.to(visualScoopContainer, { scale: 0, opacity: 0, duration: 0.3 });
      gsap.to(visualSauceLayer, { opacity: 0, scaleY: 0, duration: 0.3 });
      visualToppingLayer.innerHTML = '';
      scoopLayer1.style.opacity = '0';
      scoopLayer2.style.opacity = '0';
      currentScoopLayer = 1;

      // Reset to stage 1
      goToStep(1);
    });
  }

  // 5. Brand Story Scrollytelling Side-by-side
  const storyBeats = document.querySelectorAll('.story-beat');
  const icon1 = document.getElementById('story-icon-1');
  const icon2 = document.getElementById('story-icon-2');
  const icon3 = document.getElementById('story-icon-3');

  if (storyBeats.length > 0 && icon1 && icon2 && icon3) {
    storyBeats.forEach((beat) => {
      const idx = beat.dataset.index;
      
      ScrollTrigger.create({
        trigger: beat,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => activateIcon(idx),
        onEnterBack: () => activateIcon(idx)
      });
    });

    function activateIcon(index) {
      // Transition out the inactive icons (scale down and rotate away)
      gsap.to([icon1, icon2, icon3], { opacity: 0, scale: 0.3, rotation: -20, duration: 0.4, ease: 'power2.in' });

      // Highlight active icon with a springy Back.out easing
      let activeIcon = null;
      if (index === '1') activeIcon = icon1;
      else if (index === '2') activeIcon = icon2;
      else if (index === '3') activeIcon = icon3;

      if (activeIcon) {
        gsap.fromTo(activeIcon,
          { opacity: 0, scale: 0.3, rotation: 30 },
          { opacity: 1, scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.85)' }
        );
      }
    }
  }

  // 6. Interactive Glowing sparkles tracking mouse inside "Reserve" section
  const reserveSec = document.querySelector('.bg-darkBg');
  if (reserveSec) {
    reserveSec.addEventListener('mousemove', (e) => {
      if (Math.random() > 0.1) return;
      const rect = reserveSec.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const sparkle = document.createElement('div');
      sparkle.textContent = '✦';
      sparkle.className = 'absolute text-gold text-lg pointer-events-none select-none';
      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;
      sparkle.style.opacity = '0';
      sparkle.style.transform = 'scale(0)';

      reserveSec.appendChild(sparkle);

      gsap.to(sparkle, {
        opacity: 0.8,
        scale: 1.2,
        duration: 0.4,
        yoyo: true,
        repeat: 1,
        onComplete: () => sparkle.remove()
      });
    });
  }

  // Call this when the scoop should first appear (e.g. when user reaches Step 1)
function showScoop() {
  const container = document.getElementById('visual-scoop-container');
  if (!container) return;
  container.classList.remove('scale-0');
  container.classList.add('scale-100', 'is-active');
}

// Call this whenever user selects/changes a flavour
// flavourClass should be one of: 'flavour-vanilla', 'flavour-chocolate', 'flavour-strawberry', 'flavour-mango'
let activeLayer = 1;
function setScoopFlavour(flavourClass) {
  const layer1 = document.getElementById('scoop-layer-1');
  const layer2 = document.getElementById('scoop-layer-2');
  if (!layer1 || !layer2) return;

  const incoming = activeLayer === 1 ? layer2 : layer1;
  const outgoing = activeLayer === 1 ? layer1 : layer2;

  // Remove old flavour classes from incoming layer first
  incoming.classList.remove('flavour-vanilla', 'flavour-chocolate', 'flavour-strawberry', 'flavour-mango');
  incoming.classList.add(flavourClass);

  // Crossfade: fade incoming in, outgoing out
  incoming.style.opacity = '1';
  outgoing.style.opacity = '0';

  activeLayer = activeLayer === 1 ? 2 : 1;
}

// Call this when user picks a topping (e.g. sprinkles, choco chips)
// emoji = '🍫', topPercent/leftPercent position it on the scoop (0-100)
function addTopping(emoji, topPercent, leftPercent) {
  const layer = document.getElementById('visual-topping-layer');
  if (!layer) return;
  const item = document.createElement('span');
  item.className = 'topping-item';
  item.textContent = emoji;
  item.style.top = topPercent + '%';
  item.style.left = leftPercent + '%';
  layer.appendChild(item);
  requestAnimationFrame(() => item.classList.add('is-visible'));
}

// Call this when user picks a sauce
function pourSauce() {
  const sauce = document.getElementById('visual-sauce-layer');
  if (!sauce) return;
  sauce.classList.add('is-poured');
}

// Reset everything (e.g. "Back" button or restart)
function resetScoop() {
  const layer1 = document.getElementById('scoop-layer-1');
  const layer2 = document.getElementById('scoop-layer-2');
  const toppingLayer = document.getElementById('visual-topping-layer');
  const sauce = document.getElementById('visual-sauce-layer');

  if (layer1) { layer1.style.opacity = '0'; layer1.classList.remove('flavour-vanilla','flavour-chocolate','flavour-strawberry','flavour-mango'); }
  if (layer2) { layer2.style.opacity = '0'; layer2.classList.remove('flavour-vanilla','flavour-chocolate','flavour-strawberry','flavour-mango'); }
  if (toppingLayer) toppingLayer.innerHTML = '';
  if (sauce) sauce.classList.remove('is-poured');

  activeLayer = 1;
}


  // Example wiring — adjust selector to match your actual flavour buttons
document.querySelector('[data-flavour="vanilla"]')?.addEventListener('click', () => {
  showScoop();
  setScoopFlavour('flavour-vanilla');
});
document.querySelector('[data-flavour="chocolate"]')?.addEventListener('click', () => {
  showScoop();
  setScoopFlavour('flavour-chocolate');
});
document.querySelector('[data-flavour="strawberry"]')?.addEventListener('click', () => {
  showScoop();
  setScoopFlavour('flavour-strawberry');
});
document.querySelector('[data-flavour="mango"]')?.addEventListener('click', () => {
  showScoop();
  setScoopFlavour('flavour-mango');
});

// Example for toppings step
document.querySelector('[data-topping="choco-chips"]')?.addEventListener('click', () => {
  addTopping('🍫', 20, 50);
});
document.querySelector('[data-topping="sprinkles"]')?.addEventListener('click', () => {
  addTopping('✨', 15, 30);
});

// Example for sauce step
document.querySelector('[data-sauce="caramel"]')?.addEventListener('click', () => {
  pourSauce();
});

  // Reload custom cursor hovers (since new elements got generated)
  if (window.initCursorHovers) {
    window.initCursorHovers();
  }
});
