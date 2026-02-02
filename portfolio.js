// Initialize all features
document.addEventListener('DOMContentLoaded', function () {
  initHeader();
  initMobileMenu();
  initTypingAnimation();
  initAOS();
  initStats();
  initSkills();
  initProjectFilters();
  initProjectModal();
  initContactForm();
  initBackToTop();
  initSmoothScroll();
});

// Header Scroll Effect
function initHeader() {
  const header = document.getElementById('header');
  const headerLinks = document.querySelectorAll('.header__link, .mobile-menu__links a');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Update active link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    headerLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });
}

// Mobile Menu
function initMobileMenu() {
  const hamMenu = document.getElementById('hamMenu');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-menu__links a');

  hamMenu.addEventListener('click', function () {
    mobileMenu.classList.toggle('active');
    const spans = hamMenu.querySelectorAll('span');

    if (mobileMenu.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translateY(10px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
    } else {
      spans.forEach(span => {
        span.style.transform = 'none';
        span.style.opacity = '1';
      });
    }
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('active');
      const spans = hamMenu.querySelectorAll('span');
      spans.forEach(span => {
        span.style.transform = 'none';
        span.style.opacity = '1';
      });
    });
  });
}

// Typing Animation
function initTypingAnimation() {
  if (typeof Typed !== 'undefined') {
    const typed = new Typed('.typed-text', {
      strings: [
        'A Skilled Java Developer',
        'Building Scalable Applications',
        'Passionate About Coding',
        'Learning New Technologies',
        'Creating Digital Solutions'
      ],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 2000,
      loop: true,
      showCursor: false
    });
  }
}

// Initialize AOS (Animate On Scroll)
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
      easing: 'ease-out-cubic'
    });
  }
}

// Animated Stats Counter
function initStats() {
  const stats = document.querySelectorAll('.stat-number');
  let animated = false;

  const animateStats = () => {
    if (animated) return;

    const aboutSection = document.querySelector('.about__stats');
    if (!aboutSection) return;

    const rect = aboutSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

    if (isVisible) {
      animated = true;
      stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
          current += increment;
          if (current < target) {
            stat.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
          } else {
            stat.textContent = target;
          }
        };

        updateCounter();
      });
    }
  };

  window.addEventListener('scroll', animateStats);
  animateStats(); // Check on load
}

// Animated Skills Progress Bars
function initSkills() {
  const skillBars = document.querySelectorAll('.skill-progress');
  let skillsAnimated = false;

  const animateSkills = () => {
    if (skillsAnimated) return;

    const skillsSection = document.querySelector('.skills-content');
    if (!skillsSection) return;

    const rect = skillsSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

    if (isVisible) {
      skillsAnimated = true;
      skillBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        setTimeout(() => {
          bar.style.width = progress + '%';
        }, 100);
      });
    }
  };

  window.addEventListener('scroll', animateSkills);
  animateSkills(); // Check on load
}

// Project Filters
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const filter = this.getAttribute('data-filter');

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      // Filter projects
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');

        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          card.style.display = 'block';
        } else {
          card.classList.add('hidden');
          card.style.display = 'none';
        }
      });
    });
  });
}

// Project Modal
const projectDetails = {
  '1': {
    title: 'Weather App',
    description: 'A comprehensive weather application that fetches real-time weather data using a weather API. Features include current weather conditions, temperature display, and a 3-day forecast. The interface is clean and user-friendly, making it easy to check weather conditions for any city.',
    features: [
      'Real-time weather data',
      '3-day forecast',
      'City search functionality',
      'Temperature in Celsius/Fahrenheit',
      'Weather icons and conditions'
    ],
    technologies: ['HTML', 'CSS', 'JavaScript', 'Weather API'],
    image: 'project1.png'
  },
  '2': {
    title: 'To-Do List App',
    description: 'A feature-rich task management application that helps users organize their daily tasks. Users can add, mark as complete, and delete tasks. Local storage ensures tasks persist between sessions, providing a reliable todo list experience.',
    features: [
      'Add and delete tasks',
      'Mark tasks as complete',
      'Filter: All, Active, Completed',
      'Local storage persistence',
      'Clean and intuitive UI'
    ],
    technologies: ['HTML', 'CSS', 'JavaScript', 'LocalStorage'],
    image: 'project2.png'
  },
  '3': {
    title: 'Advanced Calculator',
    description: 'A functional calculator that performs both basic and scientific operations. Features include calculation history, theme toggle (light/dark mode), and keyboard support. The design uses glassmorphism for a modern, sleek appearance.',
    features: [
      'Basic arithmetic operations',
      'Scientific functions (sin, cos, tan, sqrt)',
      'Calculation history',
      'Theme toggle (light/dark)',
      'Keyboard support'
    ],
    technologies: ['HTML', 'CSS', 'JavaScript', 'Math.js'],
    image: 'project3.png'
  }
};

function initProjectModal() {
  const viewBtns = document.querySelectorAll('.view-details-btn');
  const modal = document.getElementById('projectModal');
  const modalClose = document.getElementById('modalClose');
  const modalBody = document.getElementById('modalBody');

  viewBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const projectId = this.getAttribute('data-project');
      const project = projectDetails[projectId];

      if (project) {
        modalBody.innerHTML = `
                    <h2 style="font-size: 2rem; margin-bottom: 1.5rem; background: var(--gradient-1); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${project.title}</h2>
                    <img src="${project.image}" alt="${project.title}" style="width: 100%; border-radius: 10px; margin-bottom: 2rem;">
                    <p style="color: var(--gray-text); line-height: 1.8; margin-bottom: 2rem;">${project.description}</p>
                    
                    <h3 style="font-size: 1.5rem; margin-bottom: 1rem;">Key Features</h3>
                    <ul style="list-style: none; margin-bottom: 2rem;">
                        ${project.features.map(feature => `
                            <li style="padding: 0.5rem 0; color: var(--gray-text); display: flex; align-items: center; gap: 0.5rem;">
                                <i class="fas fa-check" style="color: #10b981;"></i> ${feature}
                            </li>
                        `).join('')}
                    </ul>
                    
                    <h3 style="font-size: 1.5rem; margin-bottom: 1rem;">Technologies Used</h3>
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        ${project.technologies.map(tech => `
                            <span style="padding: 0.5rem 1rem; background: rgba(99, 102, 241, 0.2); color: var(--primary-color); border-radius: 20px; font-size: 0.9rem;">${tech}</span>
                        `).join('')}
                    </div>
                `;

        modal.classList.add('active');
      }
    });
  });

  modalClose.addEventListener('click', function () {
    modal.classList.remove('active');
  });

  modal.addEventListener('click', function (e) {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

// Contact Form Validation
function initContactForm() {
  const form = document.getElementById('contactForm');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Reset previous errors
      const formGroups = form.querySelectorAll('.form-group');
      formGroups.forEach(group => group.classList.remove('error'));

      let isValid = true;

      // Validate name
      const name = document.getElementById('name');
      if (name.value.trim().length < 2) {
        showError(name, 'Please enter a valid name (at least 2 characters)');
        isValid = false;
      }

      // Validate email
      const email = document.getElementById('email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value)) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
      }

      // Validate message
      const message = document.getElementById('message');
      if (message.value.trim().length < 10) {
        showError(message, 'Message must be at least 10 characters long');
        isValid = false;
      }

      if (isValid) {
        // Show success message
        const successDiv = document.getElementById('formSuccess');
        successDiv.classList.add('show');

        // Reset form
        form.reset();

        // Hide success message after 5 seconds
        setTimeout(() => {
          successDiv.classList.remove('show');
        }, 5000);
      }
    });
  }
}

function showError(input, message) {
  const formGroup = input.closest('.form-group');
  formGroup.classList.add('error');
  const errorMessage = formGroup.querySelector('.error-message');
  if (errorMessage) {
    errorMessage.textContent = message;
  }
}

// Back to Top Button
function initBackToTop() {
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  });

  backToTop.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Smooth Scroll
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href !== '') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offsetTop = target.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

// Parallax effect for hero section
window.addEventListener('scroll', function () {
  const hero = document.querySelector('.home-hero');
  if (hero) {
    const scrolled = window.pageYOffset;
    hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    hero.style.opacity = 1 - (scrolled / 700);
  }
});
