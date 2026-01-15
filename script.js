/* Mobile menu toggle */
const toggle = document.querySelector('.menu-toggle');
const menu = document.getElementById('primary-menu');
const nav = document.querySelector('.header-nav');

if (toggle && menu && nav) {
  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    menu.classList.toggle('open');
    nav.classList.toggle('open');
  });
}

/* Reusable odometer counter */
function createOdometerCounter(sectionSelector, counterSelector = '.odometer') {
  const section = document.querySelector(sectionSelector);
  if (!section) return;

  const counters = section.querySelectorAll(counterSelector);
  if (!counters.length) return;

  const animateCounter = (counter) => {
    const target = Number(counter.dataset.count);
    if (counter.dataset.animated === 'true' || isNaN(target)) return;

    let start = 0;
    const duration = 1000;
    const startTime = performance.now();

    function update(time) {
      const progress = Math.min((time - startTime) / duration, 1);
      const value = Math.floor(progress * target);
      counter.textContent = value;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent = target;
        counter.dataset.animated = 'true';
      }
    }

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          counters.forEach(animateCounter);
          observer.disconnect(); // run once
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(section);
}

/* Init */
document.addEventListener('DOMContentLoaded', () => {
  createOdometerCounter('.counter-wrapper');
  createOdometerCounter('.stats-inner');

  // Sticky Header
  const header = document.querySelector('header');

  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 100) {
      header.classList.add('sticky');

      if (currentScrollY < lastScrollY) {
        // scrolling UP → show header
        header.style.top = '0';
      } else {
        // scrolling DOWN → hide header
        header.style.top = '-100%';
      }
    } else {
      // reset when near top
      header.classList.remove('sticky');
      header.style.top = '0';
    }

    lastScrollY = currentScrollY;
  });



  //Product Carousel
  const images = [...document.querySelectorAll('.thumb')];
  const mainImage = document.getElementById('mainImage');
  const dotsContainer = document.querySelector('.dots');
  const prevBtn = document.querySelector('.arrow.left');
  const nextBtn = document.querySelector('.arrow.right');

  let current = 0;

  /* Create dots */
  images.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => showImage(i));
    dotsContainer.appendChild(dot);
  });

  const dots = [...dotsContainer.children];

  function showImage(index) {
    current = index;
    mainImage.src = images[index].src;

    images.forEach(img => img.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    images[index].classList.add('active');
    dots[index].classList.add('active');
  }

  prevBtn.onclick = () => showImage((current - 1 + images.length) % images.length);
  nextBtn.onclick = () => showImage((current + 1) % images.length);

  images.forEach((img, i) =>
    img.addEventListener('click', () => showImage(i))
  );


  // Add to Cart Logic
  const addToCart = document.getElementById('addToCart');

  function updateAccordion() {
    document.querySelectorAll('.subscription-content')
      .forEach(el => el.classList.remove('active'));

    const selected = document.querySelector('input[name="subscription"]:checked').value;
    document.querySelector(`.subscription-content.${selected}`).classList.add('active');
  }

  function updateCartLink() {
    const subscription = document.querySelector('input[name="subscription"]:checked').value;
    let fragrances = [];

    if (subscription === 'single') {
      fragrances.push(
        document.querySelector('input[name="single-fragrance"]:checked').value
      );
    }

    if (subscription === 'double') {
      fragrances.push(
        document.querySelector('input[name="double-fragrance-1"]:checked').value,
        document.querySelector('input[name="double-fragrance-2"]:checked').value
      );
    }

    addToCart.href = `#add-to-cart?sub=${subscription}&frag=${fragrances.join(',')}`;
  }

  document.addEventListener('change', () => {
    updateAccordion();
    updateCartLink();
  });

  updateAccordion();
  updateCartLink();


  // Accordion
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const btn = item.querySelector('.accordion-btn');

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all
      accordionItems.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.accordion-btn').setAttribute('aria-expanded', 'false');
      });

      // Open clicked
      if (!isOpen) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });


  // Form submission
  const form = document.getElementById('subscribeForm');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    alert('Submitted successfully');

    form.reset();
  });


  // Search Modal
  const openBtn = document.querySelector('[aria-label="Search"]');
  const modal = document.getElementById('searchModal');
  const overlay = modal.querySelector('.search-overlay');
  const dialog = modal.querySelector('.search-dialog');
  const input = modal.querySelector('.search-input');

  function openModal() {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    setTimeout(() => input.focus(), 100);
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }

  openBtn.addEventListener('click', openModal);

  /* Close when clicking overlay */
  overlay.addEventListener('click', closeModal);

  /* Prevent close when clicking inside dialog */
  dialog.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  /* Close on ESC */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
});
