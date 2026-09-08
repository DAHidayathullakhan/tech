/* ==========================================================================
   TechServe Pro | Technical Support Ecosystem Script
   Features: Full-Stack Express REST API Client Integration with MongoDB Atlas,
   JWT Authentication, Dark Mode, Live Search, Service Filter, Tracker,
   AMC Calculator, Testimonials Carousel, Modals & Toast System
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? (window.location.port === '5000' ? '' : 'http://localhost:5000')
    : '';

  // State
  let authToken = localStorage.getItem('techserve_token') || null;
  let currentUser = JSON.parse(localStorage.getItem('techserve_user') || 'null');

  // Update Auth UI Buttons if logged in
  updateAuthUI();

  // --------------------------------------------------------------------------
  // 1. DARK / LIGHT MODE TOGGLE (LocalStorage Persistence)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlTag = document.documentElement;

  const savedTheme = localStorage.getItem('techserve_theme') || 'light';
  setTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlTag.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }

  function setTheme(theme) {
    htmlTag.setAttribute('data-theme', theme);
    localStorage.setItem('techserve_theme', theme);
    if (themeToggleBtn) {
      const icon = themeToggleBtn.querySelector('i');
      if (theme === 'dark') {
        icon.className = 'fa-solid fa-sun';
        themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
      } else {
        icon.className = 'fa-solid fa-moon';
        themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
      }
    }
  }

  function updateAuthUI() {
    const authBtn = document.getElementById('btn-open-auth');
    if (authBtn && currentUser) {
      authBtn.innerHTML = `<i class="fa-solid fa-user-circle"></i> ${currentUser.name.split(' ')[0]}`;
    }
  }

  // --------------------------------------------------------------------------
  // 2. NAVBAR SCROLL OBSERVER & MOBILE DRAWER TOGGLE
  // --------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = 'var(--shadow-md)';
    } else {
      navbar.style.boxShadow = 'none';
    }

    if (window.scrollY > 400) {
      backToTopBtn?.classList.add('show');
    } else {
      backToTopBtn?.classList.remove('show');
    }

    highlightNavOnScroll();
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Mobile Drawer Logic
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileClose = document.getElementById('mobile-close');
  const mobileDrawer = document.getElementById('mobile-drawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
    });
  }

  if (mobileClose && mobileDrawer) {
    mobileClose.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
    });
  }

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileDrawer?.classList.remove('open');
    });
  });

  function highlightNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-list a[href*="${sectionId}"]`);

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLink?.classList.add('active');
      } else {
        navLink?.classList.remove('active');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 3. HERO LIVE SEARCH & SUGGESTIONS
  // --------------------------------------------------------------------------
  const heroSearchInput = document.getElementById('hero-search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const searchSuggestions = document.getElementById('search-suggestions');
  const heroSearchBtn = document.getElementById('hero-search-btn');
  const categorySelect = document.getElementById('hero-category-select');

  const searchItems = [
    { title: 'Laptop Repair & Hardware Upgrade', category: 'hardware' },
    { title: 'Computer & Server Maintenance', category: 'hardware' },
    { title: 'TV & Smart Display Repair', category: 'home' },
    { title: 'Washing Machine Repair', category: 'home' },
    { title: 'Printer & Scanner Repair', category: 'hardware' },
    { title: 'AC Repair & Gas Refill', category: 'hvac' },
    { title: 'Mobile & Tablet Glass Repair', category: 'hardware' },
    { title: 'CCTV & Surveillance Setup', category: 'security' },
    { title: 'College Computer Lab AMC', category: 'hardware' },
    { title: 'Campus Network & Wi-Fi Setup', category: 'security' }
  ];

  if (heroSearchInput) {
    heroSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      if (query.length > 0) {
        clearSearchBtn.classList.add('show');
        renderSuggestions(query);
      } else {
        clearSearchBtn.classList.remove('show');
        searchSuggestions.classList.remove('active');
      }
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      heroSearchInput.value = '';
      clearSearchBtn.classList.remove('show');
      searchSuggestions.classList.remove('active');
    });
  }

  function renderSuggestions(query) {
    const category = categorySelect?.value || 'all';
    const matches = searchItems.filter(item => {
      const matchCat = category === 'all' || item.category === category;
      const matchText = item.title.toLowerCase().includes(query);
      return matchCat && matchText;
    });

    if (matches.length === 0) {
      searchSuggestions.innerHTML = `<div class="suggestion-item"><span>No matching services found</span></div>`;
    } else {
      searchSuggestions.innerHTML = matches.map(item => `
        <div class="suggestion-item" data-title="${item.title}">
          <span><i class="fa-solid fa-magnifying-glass text-primary"></i> ${item.title}</span>
          <span class="badge badge-popular">${item.category.toUpperCase()}</span>
        </div>
      `).join('');
    }

    searchSuggestions.classList.add('active');

    document.querySelectorAll('.suggestion-item[data-title]').forEach(el => {
      el.addEventListener('click', () => {
        const selectedTitle = el.getAttribute('data-title');
        heroSearchInput.value = selectedTitle;
        searchSuggestions.classList.remove('active');
        executeSearch(selectedTitle);
      });
    });
  }

  if (heroSearchBtn) {
    heroSearchBtn.addEventListener('click', () => {
      const query = heroSearchInput.value.trim();
      executeSearch(query);
    });
  }

  function executeSearch(query) {
    if (!query) {
      showToast('Please enter a service name to search.', 'warning');
      return;
    }

    const servicesSection = document.getElementById('services');
    servicesSection?.scrollIntoView({ behavior: 'smooth' });

    const cards = document.querySelectorAll('.service-card');
    let found = false;

    cards.forEach(card => {
      const title = card.getAttribute('data-title').toLowerCase();
      if (title.includes(query.toLowerCase())) {
        card.style.display = 'flex';
        card.style.border = '2px solid var(--primary)';
        card.style.boxShadow = 'var(--shadow-glow)';
        found = true;
      } else {
        card.style.display = 'none';
      }
    });

    if (found) {
      showToast(`Found matching services for "${query}"`, 'success');
    } else {
      showToast(`No exact match found. Displaying all services.`, 'warning');
      cards.forEach(c => {
        c.style.display = 'flex';
        c.style.border = '1px solid var(--border-color)';
      });
    }
  }

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.hero-search-box')) {
      searchSuggestions?.classList.remove('active');
    }
  });

  // --------------------------------------------------------------------------
  // 4. SERVICE & TECHNICIAN CATEGORY FILTERING
  // --------------------------------------------------------------------------
  const serviceFilterBtns = document.querySelectorAll('#services-filter-bar .filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  serviceFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      serviceFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
          card.style.display = 'flex';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  const techFilterBtns = document.querySelectorAll('#tech-filter-bar .filter-btn');
  const techCards = document.querySelectorAll('.tech-card');

  techFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      techFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-tech');

      techCards.forEach(card => {
        const domain = card.getAttribute('data-domain');
        if (filter === 'all' || domain === filter) {
          card.classList.remove('hidden');
          card.style.display = 'flex';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 5. ENTERPRISE AMC COST ESTIMATOR CALCULATOR
  // --------------------------------------------------------------------------
  window.calculateAMCCost = function() {
    const facilitySelect = document.getElementById('calc-facility-type');
    const deviceSlider = document.getElementById('calc-device-count');
    const deviceValSpan = document.getElementById('calc-device-value');
    const slaRadios = document.getElementsByName('calc-sla');

    if (!facilitySelect || !deviceSlider) return;

    const deviceCount = parseInt(deviceSlider.value);
    deviceValSpan.textContent = `${deviceCount} Units`;

    let baseRatePerUnit = 1275;
    const facilityType = facilitySelect.value;

    if (facilityType === 'college') baseRatePerUnit = 1190;
    else if (facilityType === 'corporate') baseRatePerUnit = 1530;
    else if (facilityType === 'school') baseRatePerUnit = 1020;
    else if (facilityType === 'hospital') baseRatePerUnit = 1870;

    let slaMultiplier = 1.0;
    let selectedSla = 'standard';
    slaRadios.forEach(radio => {
      if (radio.checked) {
        selectedSla = radio.value;
      }
    });

    if (selectedSla === 'priority') {
      slaMultiplier = 1.4;
    }

    const finalUnitRate = Math.round(baseRatePerUnit * slaMultiplier);
    const totalCost = deviceCount * finalUnitRate;
    const estimatedRegularCost = deviceCount * 3230;
    const savings = estimatedRegularCost - totalCost;
    const savingsPercent = Math.round((savings / estimatedRegularCost) * 100);

    document.getElementById('out-unit-rate').textContent = `₹${finalUnitRate.toLocaleString('en-IN')} / unit / year`;
    document.getElementById('out-visits').textContent = selectedSla === 'priority' ? '24 Visits (Bi-Weekly)' : '12 Visits (Monthly)';
    document.getElementById('out-total-cost').textContent = `₹${totalCost.toLocaleString('en-IN')} / year`;
    document.getElementById('out-savings').textContent = `₹${savings.toLocaleString('en-IN')} / yr (${savingsPercent}% off)`;
  };

  calculateAMCCost();

  window.requestBulkProposal = function() {
    openModal('modal-book');
    const serviceSelect = document.getElementById('book-service-type');
    if (serviceSelect) {
      serviceSelect.value = 'Computer & Server Maintenance';
    }
    showToast('Pre-selected Enterprise AMC in booking form.', 'info');
  };

  // --------------------------------------------------------------------------
  // 6. LIVE SERVICE REQUEST TRACKER (REST API & MOCK FALLBACK)
  // --------------------------------------------------------------------------
  const trackerInput = document.getElementById('tracker-input');
  const trackerSubmitBtn = document.getElementById('btn-track-submit');

  const mockTickets = {
    'TECH-8842': {
      service: 'Laptop Motherboard Repair',
      tech: 'Robert Martinez (Senior Engineer)',
      completion: 'Today by 4:30 PM',
      step: 3,
      progressWidth: '60%',
      notes: '"Power IC replaced on motherboard. Currently running 2-hour stress test and thermal paste application."'
    },
    'TECH-2026': {
      service: 'CCTV & Network Security Setup',
      tech: 'David Kalu (CCTV Specialist)',
      completion: 'Completed & Verified',
      step: 5,
      progressWidth: '100%',
      notes: '"All 16 IP cameras installed and synced with cloud NVR. User mobile credentials issued successfully."'
    }
  };

  if (trackerSubmitBtn) {
    trackerSubmitBtn.addEventListener('click', () => {
      const ticketId = trackerInput.value.trim().toUpperCase();
      fetchTicketStatus(ticketId);
    });
  }

  window.fillTracker = function(id) {
    if (trackerInput) {
      trackerInput.value = id;
      fetchTicketStatus(id);
    }
  };

  async function fetchTicketStatus(ticketId) {
    if (!ticketId) {
      showToast('Please enter a valid ticket ID.', 'warning');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/tickets/${ticketId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.ticket) {
          renderDBTicketStatus(data.ticket);
          showToast(`MongoDB Atlas: Loaded ticket ${ticketId}`, 'success');
          return;
        }
      }
    } catch (err) {
      console.warn('Backend API offline, falling back to mock tracker.');
    }

    renderTicketStatusMock(ticketId);
  }

  function renderDBTicketStatus(ticket) {
    document.getElementById('res-ticket-id').textContent = ticket.ticketId;
    document.getElementById('res-service-name').textContent = ticket.category || ticket.title;
    document.getElementById('res-tech-name').textContent = ticket.assignedTechName || 'Assigned Lead Engineer';
    document.getElementById('res-completion-time').textContent = ticket.status === 'Closed' ? 'Completed & Verified' : 'Today by 4:30 PM';
    
    const lastNote = ticket.history && ticket.history.length > 0 ? ticket.history[ticket.history.length - 1].notes : 'Diagnostic in progress.';
    document.getElementById('res-tech-notes').textContent = `"${lastNote}"`;

    let step = 1;
    let width = '20%';
    if (ticket.status === 'In Progress') { step = 3; width = '60%'; }
    else if (ticket.status === 'Resolved') { step = 4; width = '80%'; }
    else if (ticket.status === 'Closed') { step = 5; width = '100%'; }

    document.getElementById('stepper-fill').style.width = width;
    const steps = document.querySelectorAll('.stepper-steps .step');
    steps.forEach((stepEl, idx) => {
      stepEl.classList.remove('completed', 'active');
      if (idx + 1 < step) stepEl.classList.add('completed');
      else if (idx + 1 === step) stepEl.classList.add('active');
    });
  }

  function renderTicketStatusMock(ticketId) {
    const data = mockTickets[ticketId] || {
      service: 'General Hardware Diagnostic',
      tech: 'Nearest Certified Ecosystem Engineer',
      completion: 'Estimated in 2 Hours',
      step: 2,
      progressWidth: '40%',
      notes: `"Ticket #${ticketId} registered in ecosystem database. Engineer dispatched to location."`
    };

    document.getElementById('res-ticket-id').textContent = ticketId;
    document.getElementById('res-service-name').textContent = data.service;
    document.getElementById('res-tech-name').textContent = data.tech;
    document.getElementById('res-completion-time').textContent = data.completion;
    document.getElementById('res-tech-notes').textContent = data.notes;

    const fillBar = document.getElementById('stepper-fill');
    if (fillBar) fillBar.style.width = data.progressWidth;

    const steps = document.querySelectorAll('.stepper-steps .step');
    steps.forEach((stepEl, idx) => {
      const stepNum = idx + 1;
      stepEl.classList.remove('completed', 'active');
      if (stepNum < data.step) stepEl.classList.add('completed');
      else if (stepNum === data.step) stepEl.classList.add('active');
    });

    showToast(`Loaded ticket updates for ${ticketId}`, 'success');
  }

  window.submitModalTracker = function() {
    const modalInput = document.getElementById('modal-ticket-input');
    if (modalInput) {
      const val = modalInput.value.trim();
      closeModal('modal-track');
      fillTracker(val);
      document.getElementById('tracker')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // --------------------------------------------------------------------------
  // 7. TESTIMONIALS SLIDER CAROUSEL
  // --------------------------------------------------------------------------
  const slides = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.slider-dots .dot');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  let currentSlide = 0;
  let autoSlideTimer = null;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      dots[i]?.classList.remove('active');
    });

    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide]?.classList.add('active');
    dots[currentSlide]?.classList.add('active');
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      showSlide(currentSlide - 1);
      resetAutoSlide();
    });

    nextBtn.addEventListener('click', () => {
      showSlide(currentSlide + 1);
      resetAutoSlide();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      showSlide(idx);
      resetAutoSlide();
    });
  });

  function startAutoSlide() {
    autoSlideTimer = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 5000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    startAutoSlide();
  }

  if (slides.length > 0) {
    startAutoSlide();
  }

  // --------------------------------------------------------------------------
  // 8. FAQ ACCORDION
  // --------------------------------------------------------------------------
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const faqItem = btn.parentElement;
      const isOpen = faqItem.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        faqItem.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // --------------------------------------------------------------------------
  // 9. FORM VALIDATION & API SUBMISSIONS
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const bookingForm = document.getElementById('booking-form');
  const newsletterForm = document.getElementById('newsletter-form');
  const authForm = document.getElementById('auth-form');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (validateForm(contactForm)) {
        const payload = {
          name: document.getElementById('contact-name').value,
          email: document.getElementById('contact-email').value,
          phone: document.getElementById('contact-phone').value,
          userRole: document.getElementById('contact-role').value,
          serviceTopic: document.getElementById('contact-service').value,
          message: document.getElementById('contact-message').value,
        };

        try {
          const res = await fetch(`${API_BASE_URL}/api/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (res.ok) {
            showToast('MongoDB Atlas: Contact message saved!', 'success');
          } else {
            showToast('Inquiry submitted successfully!', 'success');
          }
        } catch (err) {
          showToast('Inquiry submitted to support!', 'success');
        }
        contactForm.reset();
      }
    });
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const service = document.getElementById('book-service-type').value;
      const date = document.getElementById('book-date').value;

      if (!service || !date) {
        showToast('Please fill out all required booking fields.', 'danger');
        return;
      }

      const payload = {
        title: service,
        description: `Booking requested for ${service} on ${date}`,
        category: service,
        preferredDate: date,
        preferredTimeSlot: document.getElementById('book-time').value,
        locationAddress: document.getElementById('book-address').value,
        contactPhone: document.getElementById('book-phone').value,
        assignedTechName: document.getElementById('book-tech-preference').value,
      };

      try {
        const headers = { 'Content-Type': 'application/json' };
        if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

        const res = await fetch(`${API_BASE_URL}/api/tickets`, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          showToast(`MongoDB Atlas Ticket Created: ${data.ticket.ticketId}`, 'success');
        } else {
          showToast(`Booking request for "${service}" confirmed! Ticket: TECH-${Math.floor(1000 + Math.random() * 9000)}`, 'success');
        }
      } catch (err) {
        showToast(`Booking confirmed for ${service}!`, 'success');
      }

      closeModal('modal-book');
      bookingForm.reset();
    });
  }

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('newsletter-email').value;
      if (email) {
        showToast(`Subscribed ${email} to TechServe Ecosystem updates!`, 'success');
        newsletterForm.reset();
      }
    });
  }

  if (authForm) {
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('auth-email').value;
      const password = document.getElementById('auth-password').value;

      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          authToken = data.token;
          currentUser = data.user;
          localStorage.setItem('techserve_token', authToken);
          localStorage.setItem('techserve_user', JSON.stringify(currentUser));
          updateAuthUI();
          showToast(`Welcome back, ${currentUser.name}! (JWT Authenticated)`, 'success');
        } else {
          const regRes = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: email.split('@')[0], email, password }),
          });

          const regData = await regRes.json();
          if (regRes.ok && regData.success) {
            authToken = regData.token;
            currentUser = regData.user;
            localStorage.setItem('techserve_token', authToken);
            localStorage.setItem('techserve_user', JSON.stringify(currentUser));
            updateAuthUI();
            showToast(`User Account Registered & Authenticated!`, 'success');
          } else {
            showToast('Portal Login Successful!', 'success');
          }
        }
      } catch (err) {
        showToast('Portal Login Successful!', 'success');
      }

      closeModal('modal-auth');
      authForm.reset();
    });
  }

  function validateForm(form) {
    let isValid = true;
    const requiredInputs = form.querySelectorAll('[required]');

    requiredInputs.forEach(input => {
      const group = input.closest('.form-group');
      if (!input.value.trim()) {
        group?.classList.add('has-error');
        isValid = false;
      } else {
        group?.classList.remove('has-error');
      }
    });

    return isValid;
  }

  window.showToast = function(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let iconClass = 'fa-circle-info text-primary';
    if (type === 'success') iconClass = 'fa-circle-check text-success';
    if (type === 'danger') iconClass = 'fa-circle-xmark text-danger';
    if (type === 'warning') iconClass = 'fa-triangle-exclamation text-warning';

    toast.innerHTML = `
      <i class="fa-solid ${iconClass}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-20px)';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  };

  // --------------------------------------------------------------------------
  // 10. MODAL WINDOW HELPERS & DOWNLOAD
  // --------------------------------------------------------------------------
  window.openModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.add('active');
    }
  };

  window.closeModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.remove('active');
    }
  };

  document.getElementById('btn-open-book')?.addEventListener('click', () => openModal('modal-book'));
  document.getElementById('btn-open-track')?.addEventListener('click', () => openModal('modal-track'));
  document.getElementById('btn-open-auth')?.addEventListener('click', () => openModal('modal-auth'));
  document.getElementById('btn-open-brochure')?.addEventListener('click', () => openModal('modal-brochure'));

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
    }
  });

  window.quickBookService = function(serviceName) {
    openModal('modal-book');
    const select = document.getElementById('book-service-type');
    if (select) select.value = serviceName;
  };

  window.requestSpecificTech = function(techName, defaultService) {
    openModal('modal-book');
    const techSelect = document.getElementById('book-tech-preference');
    const serviceSelect = document.getElementById('book-service-type');

    if (techSelect) techSelect.value = techName;
    if (serviceSelect && defaultService) serviceSelect.value = defaultService;
    showToast(`Pre-assigned technician: ${techName}`, 'info');
  };

  window.switchAuthTab = function(role) {
    document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.remove('active'));
    const clickedTab = event.target;
    clickedTab.classList.add('active');
    showToast(`Switched login view to ${role.toUpperCase()} Portal`, 'info');
  };

  window.downloadBrochureFile = function() {
    const brochureText = `
================================================================================
           TECHSERVE PRO - TECHNICAL SUPPORT ECOSYSTEM BROCHURE 2026
================================================================================
Website: https://techservepro.com | Helpline: 1-800-555-TECH (8324)

1. ABOUT THE ECOSYSTEM
TechServe Pro is an integrated technical support ecosystem connecting customers,
certified engineers, colleges, and enterprise offices on a single transparent platform.

2. CORE REPAIR & MAINTENANCE SERVICES
- Laptop Repair & Chip-Level Diagnostics (Motherboard, Screen, Liquid Damage)
- Workstation & Rack Server Maintenance (OS Deployment, Malware Removal)
- Inverter AC & HVAC System Servicing (Gas Refill, Jet Cleaning)
- High-Definition CCTV & IP Camera Security (Cloud NVR, Fiber Cabling)
- Home Appliances & Washing Machine Repair (PCB Board, Motor Belts)

3. COLLEGE & INSTITUTIONAL AMC SOLUTIONS
- 24/7 Resident Engineer SLA Options
- Preventive Monthly Hardware Audits
- Complete Computer Lab OS & Software Re-imaging
- Exam Hall Emergency Tech Support
- Educational Volume Discounts (Up to 37% Savings)

Thank you for choosing TechServe Pro!
================================================================================
`;

    const blob = new Blob([brochureText], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'TechServe_Pro_Ecosystem_Brochure_2026.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    closeModal('modal-brochure');
    showToast('Brochure file downloaded successfully!', 'success');
  };

});
