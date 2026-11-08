/**
 * HMP-TI UNISKA BANJARMASIN DIGITAL ENTERPRISE HUB - JAVASCRIPT
 * Features:
 * 1. Sticky Navbar & Scrollspy Active Navigation
 * 2. Responsive Mobile Drawer & Backdrop
 * 3. Quick Jump Pills from Hero Section
 * 4. Unit Usaha Filter Tabs & Real-Time Keyword Search
 * 5. Interactive Student Cost Calculator & WhatsApp Checkout
 * 6. Hero Visual Interactive Preview Click-Through
 * 7. Fast Inquiry WhatsApp Order Generator
 * 8. Interactive Review Modal & Dynamic Star Selector
 * 9. Real-Time Operational Hours Check for Sekretariat UNISKA (WITA)
 * 10. Cyber Toast Notification System
 */

document.addEventListener('DOMContentLoaded', () => {

  // Format currency into Rupiah
  const formatRupiah = (number) => {
    return 'Rp ' + number.toLocaleString('id-ID');
  };

  // ==========================================
  // 1. STICKY NAVBAR & SCROLLSPY
  // ==========================================
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const trackedSections = document.querySelectorAll('section[id]');

  const handleNavScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    const scrollY = window.pageYOffset;
    trackedSections.forEach(sec => {
      const secHeight = sec.offsetHeight;
      const secTop = sec.offsetTop - 120;
      const secId = sec.getAttribute('id');

      if (scrollY > secTop && scrollY <= secTop + secHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${secId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // Initial invocation


  // ==========================================
  // 2. MOBILE MENU DRAWER & BACKDROP
  // ==========================================
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const mobileBackdrop = document.getElementById('mobile-backdrop');

  const toggleMobileNav = () => {
    const isOpen = navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
    mobileBackdrop.classList.toggle('active');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  const closeMobileNav = () => {
    navMenu.classList.remove('active');
    menuToggle.classList.remove('active');
    mobileBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (menuToggle) menuToggle.addEventListener('click', toggleMobileNav);
  if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileNav);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });


  // ==========================================
  // 3. QUICK JUMP PILLS FROM HERO SECTION
  // ==========================================
  const quickPills = document.querySelectorAll('.pill-jump');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const unitCards = document.querySelectorAll('.unit-card');
  const searchInput = document.getElementById('unit-search');
  const noResultsState = document.getElementById('no-results-state');

  let currentCategory = 'all';

  const applyUnitFilters = () => {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    let visibleCount = 0;

    unitCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const cardText = card.textContent.toLowerCase();

      const matchCategory = (currentCategory === 'all' || category === currentCategory);
      const matchSearch = (!query || cardText.includes(query));

      if (matchCategory && matchSearch) {
        card.style.display = 'flex';
        card.style.animation = 'fadeInUp 0.35s ease forwards';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noResultsState) {
      noResultsState.style.display = (visibleCount === 0) ? 'block' : 'none';
    }
  };

  // Quick Jump from Hero Pills
  quickPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const targetCategory = pill.getAttribute('data-filter-target');
      
      // Update active filter button
      filterBtns.forEach(btn => {
        if (btn.getAttribute('data-unit') === targetCategory) {
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentCategory = targetCategory;
          applyUnitFilters();
        }
      });

      // Smooth scroll to catalog
      const catalogSec = document.getElementById('unit-usaha');
      if (catalogSec) {
        catalogSec.scrollIntoView({ behavior: 'smooth' });
      }

      showCyberToast(`Menampilkan ${pill.textContent.trim()}`);
    });
  });

  // Filter Tab Buttons Click
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-unit');
      applyUnitFilters();
    });
  });

  // Search Input Listener
  if (searchInput) {
    searchInput.addEventListener('input', applyUnitFilters);
  }


  // ==========================================
  // 4. STUDENT COST CALCULATOR
  // ==========================================
  const calcInputs = {
    printBw: { el: document.getElementById('qty-print-bw'), price: 300, name: 'Print B/W (Hitam Putih)', unit: 'lembar' },
    printColor: { el: document.getElementById('qty-print-color'), price: 1000, name: 'Print Full Color', unit: 'lembar' },
    jilidHard: { el: document.getElementById('qty-jilid-hard'), price: 35000, name: 'Jilid Hardcover Skripsi FTI', unit: 'eksemplar' },
    jilidSpiral: { el: document.getElementById('qty-jilid-spiral'), price: 6000, name: 'Jilid Spiral Mika', unit: 'jilid' },
    food: { el: document.getElementById('qty-food'), price: 12000, name: 'Rice Bowl Ayam Geprek IT-Solution', unit: 'porsi' },
    drink: { el: document.getElementById('qty-drink'), price: 8000, name: 'Es Kopi Susu Aren IT-Solution', unit: 'cup' }
  };

  const calcTotalDisplay = document.getElementById('calc-total-display');
  const btnCalcOrderWA = document.getElementById('btn-calc-order-wa');

  const updateCalculatorTotal = () => {
    let grandTotal = 0;

    Object.keys(calcInputs).forEach(key => {
      const item = calcInputs[key];
      if (item.el) {
        const val = Math.max(0, parseInt(item.el.value, 10) || 0);
        grandTotal += (val * item.price);
      }
    });

    if (calcTotalDisplay) {
      calcTotalDisplay.textContent = formatRupiah(grandTotal);
    }
  };

  // Attach change/input events to all calc inputs
  Object.keys(calcInputs).forEach(key => {
    const item = calcInputs[key];
    if (item.el) {
      item.el.addEventListener('input', updateCalculatorTotal);
    }
  });

  // Order via WhatsApp from Calculator
  if (btnCalcOrderWA) {
    btnCalcOrderWA.addEventListener('click', () => {
      const selectedItems = [];
      let grandTotal = 0;

      Object.keys(calcInputs).forEach(key => {
        const item = calcInputs[key];
        if (item.el) {
          const qty = Math.max(0, parseInt(item.el.value, 10) || 0);
          if (qty > 0) {
            const subtotal = qty * item.price;
            grandTotal += subtotal;
            selectedItems.push(`- *${item.name}*: ${qty} ${item.unit} (${formatRupiah(subtotal)})`);
          }
        }
      });

      if (selectedItems.length === 0) {
        showCyberToast('Pilih minimal 1 jumlah layanan pada kalkulator.');
        return;
      }

      let waMsg = `Halo Admin IT-Solution HMP-TI UNISKA! 🚀%0A%0A` +
                  `Saya ingin memesan layanan kampus dengan rincian kalkulator berikut:%0A%0A` +
                  selectedItems.join('%0A') +
                  `%0A%0A*Total Estimasi:* ${formatRupiah(grandTotal)}%0A` +
                  `*Lokasi Pengambilan:* Sekretariat IT-Solution HMP-TI Kampus UNISKA Adyaksa%0A%0A` +
                  `Mohon info konfirmasi pesanan dan ketersediaannya ya. Terima kasih!`;

      const waURL = `https://wa.me/6281234567890?text=${waMsg}`;
      window.open(waURL, '_blank');
      showCyberToast('Membuka WhatsApp untuk mengirim rincian order!');
    });
  }


  // ==========================================
  // 5. HERO TERMINAL INTERACTIVE PREVIEW
  // ==========================================
  const heroPreviewRows = document.querySelectorAll('.preview-unit-row');
  heroPreviewRows.forEach(row => {
    row.addEventListener('click', () => {
      const targetUnit = row.getAttribute('data-unit-preview');
      
      filterBtns.forEach(btn => {
        if (btn.getAttribute('data-unit') === targetUnit) {
          btn.click();
        }
      });

      const catalogSec = document.getElementById('unit-usaha');
      if (catalogSec) {
        catalogSec.scrollIntoView({ behavior: 'smooth' });
      }

      showCyberToast(`Menampilkan detail ${row.querySelector('strong').textContent}`);
    });
  });


  // ==========================================
  // 6. FAST INQUIRY WHATSAPP GENERATOR
  // ==========================================
  const fastInquiryForm = document.getElementById('fast-inquiry-form');
  if (fastInquiryForm) {
    fastInquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('user-name').value.trim();
      const unit = document.getElementById('select-unit').value;
      const message = document.getElementById('user-message').value.trim();

      if (!name || !message) {
        showCyberToast('Mohon lengkapi nama dan rincian kebutuhan Anda.');
        return;
      }

      const waText = `Halo Admin IT-Solution (${encodeURIComponent(unit)}) HMP-TI UNISKA Banjarmasin!%0A%0A` +
                     `Nama: *${encodeURIComponent(name)}*%0A` +
                     `Unit Tujuan: *${encodeURIComponent(unit)}*%0A` +
                     `Pesan / Kebutuhan:%0A${encodeURIComponent(message)}%0A%0A` +
                     `Mohon informasi lebih lanjut mengenai alur dan estimasi biaya/waktu di Kampus Adyaksa. Terima kasih!`;

      const waURL = `https://wa.me/6281234567890?text=${waText}`;
      window.open(waURL, '_blank');

      showCyberToast('Pesan WhatsApp berhasil disiapkan!');
      fastInquiryForm.reset();
    });
  }


  // ==========================================
  // 7. REVIEW MODAL & DYNAMIC STAR RATING
  // ==========================================
  const btnOpenReviewModal = document.getElementById('btn-open-review-modal');
  const modalReview = document.getElementById('modal-review');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnCancelModal = document.getElementById('btn-cancel-modal');
  const reviewForm = document.getElementById('review-submission-form');
  const starItems = document.querySelectorAll('.star-item');
  const revScoreVal = document.getElementById('rev-score-val');
  const starScoreText = document.getElementById('star-score-text');
  const testimonialStream = document.getElementById('testimonial-stream');

  const ratingDescriptions = {
    1: '1 Bintang (Kurang Puas)',
    2: '2 Bintang (Cukup)',
    3: '3 Bintang (Standar)',
    4: '4 Bintang (Memuaskan)',
    5: '5 Bintang (Sangat Memuaskan)'
  };

  const openModal = () => {
    modalReview.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modalReview.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (btnOpenReviewModal) btnOpenReviewModal.addEventListener('click', openModal);
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
  if (btnCancelModal) btnCancelModal.addEventListener('click', closeModal);

  if (modalReview) {
    modalReview.addEventListener('click', (e) => {
      if (e.target === modalReview) closeModal();
    });
  }

  // Star selector
  starItems.forEach(star => {
    star.addEventListener('click', () => {
      const val = parseInt(star.getAttribute('data-val'), 10);
      revScoreVal.value = val;
      starScoreText.textContent = ratingDescriptions[val];

      starItems.forEach(s => {
        const sVal = parseInt(s.getAttribute('data-val'), 10);
        if (sVal <= val) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });
    });
  });

  // Review Form Submit
  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const author = document.getElementById('rev-author').value.trim();
      const department = document.getElementById('rev-department').value.trim();
      const unit = document.getElementById('rev-unit').value;
      const score = parseInt(revScoreVal.value, 10);
      const feedback = document.getElementById('rev-feedback').value.trim();

      if (!author || !feedback) {
        showCyberToast('Mohon isi nama dan pengalaman Anda.');
        return;
      }

      const initials = author.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      const starsDisplay = '★'.repeat(score) + '☆'.repeat(5 - score);

      const reviewCard = document.createElement('div');
      reviewCard.className = 'review-box';
      reviewCard.style.animation = 'fadeInUp 0.4s ease';

      reviewCard.innerHTML = `
        <div class="review-box-header">
          <div class="reviewer-avatar">${initials}</div>
          <div class="reviewer-meta">
            <h4 class="reviewer-name">${author}</h4>
            <span class="reviewer-sub">${department} • Pengguna ${unit}</span>
          </div>
          <div class="review-stars-gold">${starsDisplay}</div>
        </div>
        <p class="review-text">"${feedback}"</p>
        <div class="review-footer-date">Baru saja • Kampus Adyaksa</div>
      `;

      if (testimonialStream) {
        testimonialStream.insertBefore(reviewCard, testimonialStream.firstChild);
      }

      reviewForm.reset();
      revScoreVal.value = '5';
      starScoreText.textContent = ratingDescriptions[5];
      starItems.forEach(s => s.classList.add('active'));

      closeModal();
      showCyberToast('Terima kasih! Ulasan Anda berhasil ditampilkan.');
    });
  }


  // ==========================================
  // 8. REAL-TIME SEKRETARIAT HOURS CHECK (WITA)
  // ==========================================
  const checkSekretStatus = () => {
    const pill = document.getElementById('nav-status-pill');
    if (!pill) return;

    const now = new Date();
    const day = now.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
    const hour = now.getHours();
    const minute = now.getMinutes();
    const currentTime = hour + (minute / 60);

    // Senin - Sabtu: 08.30 - 21.00 WITA
    const isOperationalDay = (day >= 1 && day <= 6);
    const isOpen = isOperationalDay && (currentTime >= 8.5 && currentTime < 21.0);

    if (isOpen) {
      pill.innerHTML = `
        <span class="status-pulse-dot"></span>
        <span class="status-text-nav">Sekret Buka (WITA)</span>
      `;
      pill.style.borderColor = 'rgba(16, 185, 129, 0.35)';
      pill.style.background = 'rgba(16, 185, 129, 0.12)';
      pill.style.color = '#34D399';
    } else {
      pill.innerHTML = `
        <span class="status-pulse-dot" style="background-color: #F59E0B; box-shadow: 0 0 8px #F59E0B;"></span>
        <span class="status-text-nav">Sekret Tutup (Online Aktif)</span>
      `;
      pill.style.borderColor = 'rgba(245, 158, 11, 0.35)';
      pill.style.background = 'rgba(245, 158, 11, 0.12)';
      pill.style.color = '#FBBF24';
    }
  };

  checkSekretStatus();


  // ==========================================
  // 9. TOAST NOTIFICATION HELPER
  // ==========================================
  function showCyberToast(message) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span>⚡</span>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  // ==========================================
  // 10. CYBER PARTICLES & 3D CARD TILT EFFECT
  // ==========================================
  const particlesContainer = document.getElementById('cyber-particles');
  if (particlesContainer) {
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('div');
      p.className = 'cyber-sparkle-dot';
      const size = Math.random() * 4 + 2;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${Math.random() * 100}%`;
      p.style.animationDuration = `${Math.random() * 6 + 4}s`;
      p.style.animationDelay = `${Math.random() * 5}s`;
      particlesContainer.appendChild(p);
    }
  }

  // Card 3D Perspective Tilt on Mouse Movement
  const interactiveCards = document.querySelectorAll('.unit-card');
  interactiveCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // Dynamic CSS Keyframe for animations & particles
  const animationStyle = document.createElement('style');
  animationStyle.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .cyber-sparkle-dot {
      position: absolute;
      background: #00F0FF;
      border-radius: 50%;
      box-shadow: 0 0 10px #00F0FF, 0 0 20px #00F0FF;
      opacity: 0.3;
      pointer-events: none;
      animation: floatSparkle infinite alternate ease-in-out;
    }
    @keyframes floatSparkle {
      0% { transform: translateY(0) scale(0.8); opacity: 0.2; }
      50% { opacity: 0.7; }
      100% { transform: translateY(-40px) scale(1.4); opacity: 0.1; }
    }
  `;
  document.head.appendChild(animationStyle);
});
