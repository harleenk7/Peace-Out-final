// gentle fade-in on scroll
const io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target);} });
},{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// fallback for browsers without offset-path: simple left-right glide
const planeElements = document.querySelectorAll('.plane');
planeElements.forEach(p => {
  if(p && !CSS.supports('offset-path','path("M 0 0 L 1 1")')){
    p.style.offsetPath='none';
    p.style.animation='none';
    p.animate(
      [{transform:'translate(0,130px) rotate(10deg)'},
       {transform:'translate(150px,20px) rotate(0deg)'},
       {transform:'translate(300px,130px) rotate(-10deg)'}],
      {duration:7000,iterations:Infinity,direction:'alternate',easing:'ease-in-out'}
    );
  }
});

// ============ PRODUCTS CARD DECK STACK ANIMATION ============
const cardData = [
  {
    contentType: 0,
    title: "14 Days to Love Yourself Challenge",
    description: "A 14-day workbook for rest, boundaries and reconnecting – built on real exercises.",
    image: "IMG_3918.PNG",
    link: "https://topmate.io/peaceout/1967273"
  },
  {
    contentType: 1,
    title: "2026 Vision to Alignment Guide",
    description: "Vision boards with strategy, grounded planning, and monthly check-ins.",
    image: "IMG_3916.PNG",
    link: "https://topmate.io/peaceout/1855072"
  },
  {
    contentType: 2,
    title: "The Year-End Alignment Workbook",
    description: "Reflect. Release. Realign. Close one year honestly and step into next.",
    image: "IMG_3917.PNG",
    link: "https://topmate.io/peaceout/1837503"
  }
];

const positionStyles = [
  { scale: 1, y: 12, opacity: 1, zIndex: 3 },
  { scale: 0.95, y: -16, opacity: 1, zIndex: 2 },
  { scale: 0.9, y: -44, opacity: 1, zIndex: 1 }
];

let cards = [
  { id: 1, contentType: 0 },
  { id: 2, contentType: 1 },
  { id: 3, contentType: 2 }
];
let nextId = 4;
let isStackAnimating = false;

function createCardElement(card, index) {
  const data = cardData[card.contentType];
  const pos = positionStyles[index] || positionStyles[2];
  
  const div = document.createElement('div');
  div.className = 'animated-card';
  div.id = `card-${card.id}`;
  div.style.zIndex = pos.zIndex;
  div.style.transform = `translate(-50%, ${pos.y}px) scale(${pos.scale})`;
  div.style.opacity = pos.opacity;
  
  div.innerHTML = `
    <div class="card-content">
      <div class="card-image-wrapper">
        <img src="${data.image}" alt="${data.title}">
      </div>
      <div class="card-text-row">
        <div class="title-desc">
          <span class="card-title">${data.title}</span>
          <span class="card-desc">${data.description}</span>
        </div>
        <a href="${data.link}" target="_blank" rel="noopener noreferrer" class="btn-read-now">
          Buy
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square">
            <path d="M9.5 18L15.5 12L9.5 6"></path>
          </svg>
        </a>
      </div>
    </div>
  `;
  return div;
}

function initStack() {
  const container = document.getElementById('card-stack');
  if (!container) return;
  container.innerHTML = '';
  cards.forEach((card, index) => {
    const cardEl = createCardElement(card, index);
    container.appendChild(cardEl);
  });
}

function handleStackNav(direction) {
  if (isStackAnimating) return;
  isStackAnimating = true;

  const container = document.getElementById('card-stack');
  if (!container) return;

  const oldFrontCard = cards[0];
  const oldFrontEl = document.getElementById(`card-${oldFrontCard.id}`);

  // 1. Fly the front card out in the chosen direction
  const flyX = direction === 'right' ? '120%' : '-220%';
  if (oldFrontEl) {
    oldFrontEl.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease';
    oldFrontEl.style.transform = `translate(${flyX}, 12px) scale(0.92) rotate(${direction === 'right' ? '8deg' : '-8deg'})`;
    oldFrontEl.style.opacity = '0';
    oldFrontEl.style.zIndex = '10';
  }

  // 2. Promote middle and back cards to their new positions
  const card1El = document.getElementById(`card-${cards[1].id}`);
  if (card1El) {
    card1El.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1), opacity 0.6s ease';
    card1El.style.transform = `translate(-50%, 12px) scale(1)`;
    card1El.style.zIndex = '3';
    card1El.style.opacity = '1';
  }

  const card2El = document.getElementById(`card-${cards[2].id}`);
  if (card2El) {
    card2El.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1), opacity 0.6s ease';
    card2El.style.transform = `translate(-50%, -16px) scale(0.95)`;
    card2El.style.zIndex = '2';
    card2El.style.opacity = '1';
  }

  // 3. Wait for the front card to fully fade out, then snap it to the back and fade in
  setTimeout(() => {
    if (oldFrontEl) {
      // Snap directly to the final back position (still invisible)
      oldFrontEl.style.transition = 'none';
      oldFrontEl.style.transform = 'translate(-50%, -44px) scale(0.9)';
      oldFrontEl.style.zIndex = '1';

      // Force reflow so the snap takes effect before the fade
      oldFrontEl.offsetHeight;

      // Just fade in — no sliding, no directional artifact
      oldFrontEl.style.transition = 'opacity 0.4s ease';
      oldFrontEl.style.opacity = '1';
    }

    // 4. Update the array (the card that flew away is now at the back)
    cards.push(cards.shift());

    isStackAnimating = false;
  }, 500); // Wait until the card is fully off-screen/transparent
}

document.addEventListener('DOMContentLoaded', () => {
  initStack();

  const btnLeft = document.getElementById('btn-stack-left');
  const btnRight = document.getElementById('btn-stack-right');
  if (btnLeft)  btnLeft.addEventListener('click',  () => handleStackNav('left'));
  if (btnRight) btnRight.addEventListener('click', () => handleStackNav('right'));

  // Accordion toggle logic for about-cards
  document.querySelectorAll('.about-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('active');
    });
  });
});
// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', () => {
  // Create overlay for background blur
  const overlay = document.createElement('div');
  overlay.className = 'mobile-menu-overlay';
  document.body.appendChild(overlay);

  const closeMenu = (navBar) => {
    navBar.classList.remove('nav-open');
    const toggle = navBar.querySelector('.mobile-menu-toggle');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    overlay.classList.remove('active');
  };

  overlay.addEventListener('click', () => {
    document.querySelectorAll('.nav-bar.nav-open').forEach(nav => closeMenu(nav));
  });

  const toggles = document.querySelectorAll('.mobile-menu-toggle');
  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const navBar = toggle.closest('.nav-bar');
      if (navBar) {
        navBar.classList.toggle('nav-open');
        const isExpanded = navBar.classList.contains('nav-open');
        toggle.setAttribute('aria-expanded', isExpanded);
        
        if (isExpanded) {
          // Lock body scroll completely
          document.body.style.overflow = 'hidden';
          document.body.style.position = 'fixed';
          document.body.style.width = '100%';
          document.body.style.top = `-${window.scrollY}px`;
          overlay.classList.add('active');
        } else {
          // Restore body scroll
          const scrollY = document.body.style.top;
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.width = '';
          document.body.style.top = '';
          window.scrollTo(0, parseInt(scrollY || '0') * -1);
          overlay.classList.remove('active');
        }
      }
    });
  });

  // Close mobile menu when a link is clicked
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const navBar = link.closest('.nav-bar');
      if (navBar && navBar.classList.contains('nav-open')) {
        closeMenu(navBar);
      }
    });
  });
});
