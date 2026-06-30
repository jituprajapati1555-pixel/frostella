// Contact Page Specific Logic: Kinetic Headline, Store locator filters, Map switcher, Accordion expanders
document.addEventListener('DOMContentLoaded', () => {

  // 1. Kinetic Text Reveal on Load
  const contactHeadline = document.getElementById('contact-hero-headline');
  if (contactHeadline) {
    const text = contactHeadline.innerHTML.trim().replace(/<br\s*\/?>/g, ' <br> ');
    const words = text.split(/\s+/);
    contactHeadline.innerHTML = '';
    
    words.forEach((word) => {
      if (word === '<br>') {
        contactHeadline.appendChild(document.createElement('br'));
      } else {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'inline-block mr-2 select-none';
        
        const chars = word.split('');
        chars.forEach((char) => {
          const charSpan = document.createElement('span');
          charSpan.textContent = char;
          charSpan.className = 'contact-char inline-block opacity-0 translate-y-12 rotate-[12deg]';
          wordSpan.appendChild(charSpan);
        });
        contactHeadline.appendChild(wordSpan);
      }
    });

    gsap.to('.contact-char', {
      opacity: 1,
      y: 0,
      rotation: 0,
      duration: 0.9,
      stagger: 0.02,
      ease: 'elastic.out(1.1, 0.75)',
      delay: 0.2
    });
  }

  // 2. FAQ Accordion Logic
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    const iconWrapper = item.querySelector('.faq-icon-wrapper');

    trigger.addEventListener('click', () => {
      const isOpen = !content.classList.contains('h-0');
      
      // Close all other FAQs first
      faqItems.forEach(otherItem => {
        const otherContent = otherItem.querySelector('.faq-content');
        const otherIcon = otherItem.querySelector('.faq-icon-wrapper');
        
        gsap.to(otherContent, { height: 0, duration: 0.4, ease: 'power3.out' });
        otherContent.classList.add('h-0');
        gsap.to(otherIcon, { rotation: 0, duration: 0.3 });
      });

      if (!isOpen) {
        // Measure exact height
        content.classList.remove('h-0');
        const targetHeight = content.scrollHeight;
        
        gsap.fromTo(content, 
          { height: 0 }, 
          { height: targetHeight, duration: 0.4, ease: 'power3.out' }
        );
        
        // Rotate plus icon to 45 deg representing "X"
        gsap.to(iconWrapper, { rotation: 45, duration: 0.3 });
      } else {
        gsap.to(content, { height: 0, duration: 0.4, ease: 'power3.out', onComplete: () => {
          content.classList.add('h-0');
        }});
        gsap.to(iconWrapper, { rotation: 0, duration: 0.3 });
      }
    });
  });

  // 3. Interactive Store Locator Filtering & Map Updating
  const citySelect = document.getElementById('locator-select');
  const storeCards = document.querySelectorAll('.store-card');
  const locatorMap = document.getElementById('locator-map');

  const mapEmbeds = {
    ahmedabad: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117510.98595304381!2d72.43962657788487!3d23.020243689408546!2m3!1f0!2f0!3f0!3m2!1i1024!2i769!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fccd11d08777002!2sC%20G%20Road%2C%20Ahmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
    mumbai: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120674.37324838634!2d72.77817457788887!3d19.076090489407!2m3!1f0!2f0!3f0!3m2!1i1024!2i769!4f13.1!3m3!1m2!1s0x3be7c91130722dd7%3A0xe7264e16d47b594b!2sBandra%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000001!5m2!1sen!2sin',
    delhi: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112062.29859530435!2d77.1264875778832!3d28.613939689408053!2m3!1f0!2f0!3f0!3m2!1i1024!2i769!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x52c2b7494e204d!2sConnaught%20Place%2C%20New%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1700000000002!5m2!1sen!2sin'
  };

  if (citySelect && storeCards.length > 0 && locatorMap) {
    
    // Select filter change event
    citySelect.addEventListener('change', (e) => {
      const city = e.target.value;
      filterStores(city);
    });

    // Individual card click event
    storeCards.forEach(card => {
      card.addEventListener('click', () => {
        // Highlight card
        storeCards.forEach(c => c.classList.remove('border-accent', 'bg-pink/15'));
        card.classList.add('border-accent', 'bg-pink/15');

        // Swap map source
        const city = card.dataset.city;
        if (mapEmbeds[city]) {
          locatorMap.src = mapEmbeds[city];
        }
      });
    });

    function filterStores(city) {
      const cardsToHide = [];
      const cardsToShow = [];

      storeCards.forEach(card => {
        if (city === 'all' || card.dataset.city === city) {
          cardsToShow.push(card);
        } else {
          cardsToHide.push(card);
        }
      });

      // Animate filter changes smoothly
      if (cardsToHide.length > 0) {
        gsap.to(cardsToHide, {
          opacity: 0,
          scale: 0.95,
          y: -10,
          duration: 0.3,
          stagger: 0.05,
          onComplete: () => {
            cardsToHide.forEach(c => c.classList.add('hidden'));
          }
        });
      }

      setTimeout(() => {
        cardsToShow.forEach(c => {
          c.classList.remove('hidden');
        });
        
        gsap.fromTo(cardsToShow, 
          { opacity: 0, scale: 0.95, y: 15 },
          { opacity: 1, scale: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' }
        );
      }, cardsToHide.length > 0 ? 300 : 0);

      // Auto update map to first visible card's city
      if (city !== 'all' && mapEmbeds[city]) {
        locatorMap.src = mapEmbeds[city];
        
        // Highlight corresponding card
        storeCards.forEach(c => {
          if (c.dataset.city === city) {
            c.classList.add('border-accent', 'bg-pink/15');
          } else {
            c.classList.remove('border-accent', 'bg-pink/15');
          }
        });
      } else {
        // Default to Ahmedabad headquarters map on 'all'
        locatorMap.src = mapEmbeds.ahmedabad;
        storeCards.forEach(c => c.classList.remove('border-accent', 'bg-pink/15'));
      }
    }
  }

  // Refresh cursor handlers for dynamic layouts
  if (window.initCursorHovers) {
    window.initCursorHovers();
  }
});
