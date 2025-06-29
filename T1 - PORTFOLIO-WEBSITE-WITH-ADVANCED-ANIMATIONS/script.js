// ==================== Load Portfolio Data ====================
fetch('data.json')
  .then(res => res.json())
  .then(data => {
    const { name, role, about, image, technologies, projects, contacts } = data;

    // --- GitHub Links ---
    const github = contacts.find(c => c.type === 'github');
    if (github) {
      document.getElementById('github-link').href = github.href;
      document.getElementById('footer-github').href = github.href;
    }

    // --- Hero Section ---
    document.getElementById('hero-name').textContent = name;
    document.getElementById('hero-role').textContent = role;

    // --- About Section ---
    document.getElementById('about-text').textContent = about;

    const aboutPhoto = document.createElement('img');
    aboutPhoto.src = image;
    aboutPhoto.alt = `${name}'s photo`;
    aboutPhoto.className = 'about-photo';
    document.getElementById('about-photo').appendChild(aboutPhoto);

    // --- Projects Section ---
    const projectContainer = document.getElementById('projects-container');
    projects.forEach(({ title, description, live, github }) => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.innerHTML = `
        <h3>${title}</h3>
        <p>${description}</p>
        <div class="project-links">
          <a href="${live}" target="_blank" rel="noopener">Live</a>
          <a href="${github}" target="_blank" rel="noopener">GitHub</a>
        </div>
      `;
      projectContainer.appendChild(card);
    });

    // --- Technologies Section ---
    const techList = document.getElementById('technologies-list');
    technologies.forEach(tech => {
      const badge = document.createElement('span');
      badge.className = 'tech-badge';
      badge.textContent = tech;
      techList.appendChild(badge);
    });

    // --- Contact Section (excluding GitHub) ---
    const contactSpan = document.getElementById('contacts');
    contacts.filter(c => c.type !== 'github').forEach(({ href, type }) => {
      const link = document.createElement('a');
      link.href = href;
      link.target = '_blank';
      link.rel = 'noopener';
      link.className = 'contact-link';

      const icon = document.createElement('i');
      icon.className = getContactIcon(type);

      link.appendChild(icon);
      link.append(` ${type}`);
      contactSpan.appendChild(link);
    });

    // Run Animations
    runAnimations();
  })
  .catch(err => console.error('❌ Failed to load portfolio data:', err));


// ==================== Helper Functions ====================

// Returns FontAwesome icon class based on contact type
function getContactIcon(type) {
  switch (type.toLowerCase()) {
    case 'email': return 'fas fa-envelope';
    case 'linkedin': return 'fab fa-linkedin';
    case 'twitter': return 'fab fa-twitter';
    case 'website': return 'fas fa-globe';
    case 'phone': return 'fas fa-phone';
    default: return 'fas fa-link';
  }
}


// ==================== Theme Toggle ====================
const toggleBtn = document.getElementById('theme-toggle');
const root = document.documentElement;

// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
  root.classList.add('dark');
}

// Toggle theme
toggleBtn.addEventListener('click', () => {
  root.classList.toggle('dark');
  const theme = root.classList.contains('dark') ? 'dark' : 'light';
  localStorage.setItem('theme', theme);
});


// ==================== GSAP Animations ====================
function runAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // Hero section on load
  gsap.from(".hero-intro", { duration: 1, opacity: 0, y: 20, ease: "power2.out" });
  gsap.from("#hero-name", { duration: 1, opacity: 0, y: 20, delay: 0.3, ease: "power2.out" });
  gsap.from("#hero-role", { duration: 1, opacity: 0, y: 20, delay: 0.6, ease: "power2.out" });
  gsap.from(".tech-badge", {
    duration: 0.6,
    opacity: 0,
    scale: 0.8,
    stagger: 0.1,
    delay: 1,
    ease: "back.out(1.7)"
  });

  // Projects scroll animation
  gsap.utils.toArray('.project-card').forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none none"
      },
      opacity: 0,
      y: 30,
      duration: 0.6,
      delay: index * 0.1,
      ease: "power2.out"
    });
  });

  // About section
  gsap.from('#about-photo img', {
    scrollTrigger: {
      trigger: '#about-photo',
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    x: -50,
    opacity: 0,
    duration: 1,
    ease: 'power2.out'
  });

  gsap.from('.about-text', {
    scrollTrigger: {
      trigger: '.about-text',
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    x: 50,
    opacity: 0,
    duration: 1,
    delay: 0.2,
    ease: 'power2.out'
  });

  // Contact links
  gsap.from('.contact-link', {
    scrollTrigger: {
      trigger: '#contact',
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    scale: 0.8,
    duration: 0.5,
    stagger: 0.1,
    ease: 'back.out(1.7)'
  });

  // Footer fade-in
  gsap.from('footer', {
    scrollTrigger: {
      trigger: 'footer',
      start: 'top bottom',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power2.out'
  });
}
