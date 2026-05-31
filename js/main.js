/* ============================================
   SALSABILLA PORTFOLIO — MAIN.JS
   All interactivity, animations & effects
============================================ */

// ---- CUSTOM CURSOR ----
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

// Cursor enlarge on hover
document.querySelectorAll('a, button, .cert-card, .exp-card, .contact-card, .gallery-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorFollower.style.width = '60px';
    cursorFollower.style.height = '60px';
    cursorFollower.style.opacity = '0.4';
    cursorFollower.style.borderColor = 'var(--blue-deep)';
  });
  el.addEventListener('mouseleave', () => {
    cursorFollower.style.width = '36px';
    cursorFollower.style.height = '36px';
    cursorFollower.style.opacity = '0.6';
    cursorFollower.style.borderColor = 'var(--blue-light)';
  });
});

// ---- NAVBAR ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  // Back to top button
  const backTop = document.getElementById('backTop');
  if (window.scrollY > 400) {
    backTop.classList.add('show');
  } else {
    backTop.classList.remove('show');
  }
});

// ---- HAMBURGER / MOBILE MENU ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
  });
});

// ---- REVEAL ON SCROLL (Intersection Observer) ----
const revealElements = document.querySelectorAll('.reveal-up, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Stagger children if multiple in same container
      const delay = Array.from(entry.target.parentElement.children)
        .indexOf(entry.target) * 100;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealElements.forEach(el => revealObserver.observe(el));

// ---- SKILL BARS ANIMATION ----
const skillFills = document.querySelectorAll('.skill-fill');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      const width = fill.getAttribute('data-width');
      fill.style.width = width + '%';
      skillObserver.unobserve(fill);
    }
  });
}, { threshold: 0.3 });
skillFills.forEach(fill => skillObserver.observe(fill));

// ---- COUNTER ANIMATION ----
const statNums = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target'));
      animateCounter(el, 0, target, 1200);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(el => counterObserver.observe(el));

function animateCounter(el, start, end, duration) {
  const range = end - start;
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(start + range * eased);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = end;
  }
  requestAnimationFrame(update);
}

// ---- SMOOTH SCROLL FOR NAV LINKS ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- ACTIVE NAV LINK ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.style.color = 'var(--blue-deep)';
        }
      });
    }
  });
}, { threshold: 0.4 });
sections.forEach(sec => sectionObserver.observe(sec));

// ---- PHOTO GALLERY MODAL ----
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

function openPhotoModal(imgSrc, title, desc) {
  const modal = document.getElementById('photoModal');
  const modalPhoto = document.getElementById('modalPhoto');
  const modalTitle = document.getElementById('modalPhotoTitle');
  const modalDesc = document.getElementById('modalPhotoDesc');
  const container = document.getElementById('photoContainer');

  modalPhoto.src = imgSrc;
  modalTitle.textContent = title;
  modalDesc.textContent = desc;

  // Reset position
  container.style.transform = 'translate(0, 0)';
  dragOffsetX = 0;
  dragOffsetY = 0;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Make modal draggable
  makeModalDraggable(container);
}

function closePhotoModal() {
  const modal = document.getElementById('photoModal');
  modal.classList.remove('open');
  document.body.style.overflow = '';
  isDragging = false;
}

function makeModalDraggable(container) {
  let offsetX = 0;
  let offsetY = 0;

  container.addEventListener('mousedown', (e) => {
    if (e.target.closest('.modal-close-btn')) return;
    isDragging = true;
    offsetX = e.clientX - dragOffsetX;
    offsetY = e.clientY - dragOffsetY;
    container.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    dragOffsetX = e.clientX - offsetX;
    dragOffsetY = e.clientY - offsetY;
    
    // Limit drag range
    const maxX = window.innerWidth / 4;
    const maxY = window.innerHeight / 4;
    dragOffsetX = Math.max(-maxX, Math.min(maxX, dragOffsetX));
    dragOffsetY = Math.max(-maxY, Math.min(maxY, dragOffsetY));
    
    container.style.transform = `translate(${dragOffsetX}px, ${dragOffsetY}px)`;
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    container.style.cursor = 'grab';
  });
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePhotoModal();
});

// ---- CERTIFICATE MODAL ----
function openCertModal(imgSrc, title, issuer, year) {
  const modal = document.getElementById('certModal');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalIssuer = document.getElementById('modalIssuer');
  const modalYear = document.getElementById('modalYear');
  const placeholder = document.getElementById('modalPlaceholder');

  modalImg.src = imgSrc;
  modalImg.style.display = 'block';
  placeholder.style.display = 'none';
  modalTitle.textContent = title;
  modalIssuer.textContent = issuer;
  modalYear.textContent = '📅 ' + year;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCertModal() {
  document.getElementById('certModal').classList.remove('open');
  document.body.style.overflow = '';
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCertModal();
});

// ---- CONTACT FORM ----
function handleFormSubmit(e) {
  e.preventDefault();
  const form = document.getElementById('contactForm');
  const msgEl = document.getElementById('formMsg');
  const btn = form.querySelector('button[type="submit"]');

  // Simulate sending
  btn.disabled = true;
  btn.innerHTML = '<span>Mengirim...</span> <i class="fa-solid fa-spinner fa-spin"></i>';

  setTimeout(() => {
    form.reset();
    btn.disabled = false;
    btn.innerHTML = '<span>Kirim Pesan</span> <i class="fa-solid fa-paper-plane"></i>';
    msgEl.textContent = '✅ Pesan terkirim! Aku akan balas secepatnya ya~ 💙';
    msgEl.className = 'form-msg success';
    setTimeout(() => { msgEl.textContent = ''; msgEl.className = 'form-msg'; }, 5000);
  }, 1800);
}

// ---- TYPING EFFECT FOR HERO SUBTITLE ----
const subtitleEl = document.querySelector('.hero-subtitle');
if (subtitleEl) {
  const texts = [
    'Software Engineering Student',
    'UI/UX Enthusiast',
    'Creative Developer',
    'Problem Solver 💡',
    'Future Tech Leader 🚀'
  ];
  let textIndex = 0, charIndex = 0, isDeleting = false;
  const originalSubtitle = subtitleEl.textContent;

  function typeEffect() {
    const current = texts[textIndex];
    if (isDeleting) {
      subtitleEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      subtitleEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }
    if (!isDeleting && charIndex === current.length) {
      setTimeout(() => { isDeleting = true; }, 2000);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
    }
    const speed = isDeleting ? 50 : 80;
    setTimeout(typeEffect, speed);
  }
  setTimeout(typeEffect, 1000);
}

// ---- PARALLAX BLOBS ----
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const blob1 = document.querySelector('.blob-1');
  const blob2 = document.querySelector('.blob-2');
  const blob3 = document.querySelector('.blob-3');
  if (blob1) blob1.style.transform = `translateY(${scrollY * 0.08}px)`;
  if (blob2) blob2.style.transform = `translateY(${scrollY * -0.05}px)`;
  if (blob3) blob3.style.transform = `translateY(${scrollY * 0.04}px)`;
});

// ---- CARD TILT EFFECT ----
document.querySelectorAll('.exp-card, .timeline-card, .skill-category, .gallery-item').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    if (card.classList.contains('gallery-item')) return; // Skip gallery tilt for scattered layout
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-5px)`;
  });
  card.addEventListener('mouseleave', () => {
    if (card.classList.contains('gallery-item')) return;
    card.style.transform = '';
  });
});

// ---- PAGE LOAD ANIMATION ----
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 50);
});

console.log('%c✨ Salsabilla Nurul Hassanah Portfolio', 'color: #2563EB; font-size: 18px; font-weight: bold;');
console.log('%c💙 Made with love & code', 'color: #7BB8F0; font-size: 12px;');
