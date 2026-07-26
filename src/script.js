// gentle fade-in on scroll
const io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target);} });
},{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// fallback for browsers without offset-path: simple left-right glide
const plane = document.querySelector('.plane');
if(plane && !CSS.supports('offset-path','path("M 0 0 L 1 1")')){
  plane.style.offsetPath='none';
  plane.style.animation='none';
  plane.animate(
    [{transform:'translate(0,130px) rotate(10deg)'},
     {transform:'translate(150px,20px) rotate(0deg)'},
     {transform:'translate(300px,130px) rotate(-10deg)'}],
    {duration:7000,iterations:Infinity,direction:'alternate',easing:'ease-in-out'}
  );
}

// ============ PRODUCTS CARD DECK STACK ANIMATION ============
const cardData = [
  {
    contentType: 0,
    title: "14 Days to Love Yourself Challenge",
    description: "A mindful challenge to rest, set boundaries and reconnect.",
    image: "IMG_3918.PNG",
    link: "https://topmate.io/peaceout/1967273"
  },
  {
    contentType: 1,
    title: "The Vision to Alignment Guide",
    description: "A step-by-step guide to create aligned vision boards",
    image: "IMG_3916.PNG",
    link: "https://topmate.io/peaceout/1855072"
  },
  {
    contentType: 2,
    title: "The Year-End Alignment Workbook",
    description: "A 2025 reflection and reset workbook for real growth.",
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

function handleAnimateStack() {
  if (isStackAnimating) return;
  isStackAnimating = true;
  
  const container = document.getElementById('card-stack');
  if (!container) return;
  
  const oldFrontCard = cards[0];
  const oldFrontEl = document.getElementById(`card-${oldFrontCard.id}`);
  
  // 1. Exit the front card downwards
  if (oldFrontEl) {
    oldFrontEl.style.transform = `translate(-50%, 500px) scale(1)`;
    oldFrontEl.style.opacity = '0';
    oldFrontEl.style.zIndex = '10';
  }
  
  // 2. Slide the middle and back cards down
  const card1El = document.getElementById(`card-${cards[1].id}`);
  if (card1El) {
    card1El.style.transform = `translate(-50%, 12px) scale(1)`;
    card1El.style.zIndex = '3';
  }
  
  const card2El = document.getElementById(`card-${cards[2].id}`);
  if (card2El) {
    card2El.style.transform = `translate(-50%, -16px) scale(0.95)`;
    card2El.style.zIndex = '2';
  }
  
  // 3. Create the new entering card at the back
  const nextContentType = (cards[2].contentType + 1) % cardData.length;
  const newCard = { id: nextId++, contentType: nextContentType };
  cards.push(newCard);
  
  const enterCardEl = createCardElement(newCard, 2);
  enterCardEl.style.transform = `translate(-50%, -16px) scale(0.9)`;
  enterCardEl.style.opacity = '0';
  enterCardEl.style.zIndex = '1';
  container.appendChild(enterCardEl);
  
  // force reflow
  enterCardEl.offsetHeight;
  
  // transition to back/top position
  enterCardEl.style.transform = `translate(-50%, -44px) scale(0.9)`;
  enterCardEl.style.opacity = '1';
  
  // 4. Clean up old card and reset animation lock after transition
  setTimeout(() => {
    if (oldFrontEl && oldFrontEl.parentNode) {
      oldFrontEl.parentNode.removeChild(oldFrontEl);
    }
    cards.shift();
    isStackAnimating = false;
  }, 900);
}

document.addEventListener('DOMContentLoaded', () => {
  initStack();
  const animBtn = document.getElementById('btn-animate-stack');
  if (animBtn) {
    animBtn.addEventListener('click', handleAnimateStack);
  }
  
  // Accordion toggle logic for about-cards
  document.querySelectorAll('.about-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('active');
    });
  });


});
