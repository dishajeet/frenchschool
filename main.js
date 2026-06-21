document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initFAQ();
  initTestimonials();
  initBookingCalendar();
  initModals();
  initForms();
});

/* --- Mobile Navigation --- */
function initMobileNav() {
  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.nav-menu');
  
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      menu.classList.toggle('active');
    });

    // Close menu when clicking a link
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        menu.classList.remove('active');
      });
    });
  }
}

/* --- FAQ Accordion --- */
function initFAQ() {
  const faqHeaders = document.querySelectorAll('.faq-header');
  
  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');
      
      // Close all other items in this FAQ list
      const list = item.parentElement;
      list.querySelectorAll('.faq-item').forEach(otherItem => {
        otherItem.classList.remove('active');
      });
      
      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* --- Testimonial Slider --- */
function initTestimonials() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.querySelector('.testimonial-dots');
  
  if (slides.length === 0) return;
  
  let currentSlide = 0;
  
  // Create dots if not present
  if (dotsContainer && dotsContainer.children.length === 0) {
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('dot');
      if (index === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });
  }
  
  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];
    if (dots.length > 0) dots[currentSlide].classList.remove('active');
    
    currentSlide = index;
    
    slides[currentSlide].classList.add('active');
    if (dots.length > 0) dots[currentSlide].classList.add('active');
  }
  
  // Auto rotation
  let slideInterval = setInterval(() => {
    let next = (currentSlide + 1) % slides.length;
    goToSlide(next);
  }, 6000);
  
  // Pause on hover
  const container = document.querySelector('.testimonials-container');
  if (container) {
    container.addEventListener('mouseenter', () => clearInterval(slideInterval));
    container.addEventListener('mouseleave', () => {
      slideInterval = setInterval(() => {
        let next = (currentSlide + 1) % slides.length;
        goToSlide(next);
      }, 6000);
    });
  }
}

/* --- Mock Booking Calendar --- */
function initBookingCalendar() {
  const calendarDays = document.querySelectorAll('.calendar-day.available');
  const slotsContainer = document.querySelector('.time-slots-container');
  const slotsGrid = document.querySelector('.time-slots-grid');
  const selectedDateText = document.querySelector('.selected-date-display');
  const summaryBlock = document.querySelector('.booking-summary');
  const summaryDetails = document.querySelector('.booking-details-text');
  const confirmBtn = document.getElementById('confirm-booking-btn');
  
  if (calendarDays.length === 0) return;
  
  let selectedDate = '';
  let selectedTime = '';
  
  const mockTimes = ['9:00 AM', '10:30 AM', '1:00 PM', '2:30 PM', '4:00 PM'];
  
  calendarDays.forEach(day => {
    day.addEventListener('click', () => {
      // Clear previous selected day
      document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
      day.classList.add('selected');
      
      selectedDate = `October ${day.textContent}, 2026`;
      if (selectedDateText) {
        selectedDateText.textContent = selectedDate;
      }
      
      // Populate time slots
      if (slotsGrid) {
        slotsGrid.innerHTML = '';
        mockTimes.forEach(time => {
          const slot = document.createElement('div');
          slot.classList.add('time-slot');
          slot.textContent = time;
          slot.addEventListener('click', () => {
            document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');
            selectedTime = time;
            
            // Show booking summary
            if (summaryBlock && summaryDetails) {
              summaryDetails.innerHTML = `<strong>Free Trial Assessment Lesson</strong><br>📅 ${selectedDate}<br>⏰ ${selectedTime} (Eastern Time)`;
              summaryBlock.classList.add('active');
            }
          });
          slotsGrid.appendChild(slot);
        });
      }
      
      if (slotsContainer) {
        slotsContainer.classList.add('active');
      }
      
      // Hide summary until a time is chosen
      if (summaryBlock) {
        summaryBlock.classList.remove('active');
      }
    });
  });
  
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      showToast('🎉 Booking Successful! We have sent a confirmation email with details.');
      
      // Reset UI
      document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
      if (slotsContainer) slotsContainer.classList.remove('active');
      if (summaryBlock) summaryBlock.classList.remove('active');
      
      // Close modal if calendar is inside a modal
      const modal = document.getElementById('booking-modal');
      if (modal && modal.classList.contains('active')) {
        setTimeout(() => {
          modal.classList.remove('active');
        }, 1000);
      }
    });
  }
}

/* --- Modals --- */
function initModals() {
  const bookingModal = document.getElementById('booking-modal');
  const leadModal = document.getElementById('lead-modal');
  
  const bookingBtns = document.querySelectorAll('.cta-booking-trigger');
  const leadBtns = document.querySelectorAll('.cta-lead-trigger');
  
  const closeBtns = document.querySelectorAll('.modal-close');
  const overlays = document.querySelectorAll('.modal-overlay');
  
  // Helper to open modal
  window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // prevent bg scroll
    }
  };
  
  // Helper to close modals
  window.closeModals = function() {
    const activeModals = document.querySelectorAll('.modal-overlay.active');
    activeModals.forEach(m => m.classList.remove('active'));
    document.body.style.overflow = '';
  };
  
  bookingBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // If we are already on contact.html, we can scroll to the calendar instead of opening a modal
      if (window.location.pathname.includes('contact.html')) {
        const cal = document.getElementById('booking-calendar-section');
        if (cal) {
          e.preventDefault();
          cal.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      
      // Otherwise, open modal
      e.preventDefault();
      openModal('booking-modal');
    });
  });
  
  leadBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // Configure lead magnet modal based on the clicked element's data attributes if desired
      const resource = btn.getAttribute('data-resource') || 'Free Study Guide';
      const inputRes = document.getElementById('lead-resource-name');
      if (inputRes) {
        inputRes.value = resource;
      }
      const titleRes = document.getElementById('lead-title-display');
      if (titleRes) {
        titleRes.textContent = resource;
      }
      openModal('lead-modal');
    });
  });
  
  closeBtns.forEach(btn => {
    btn.addEventListener('click', closeModals);
  });
  
  overlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModals();
      }
    });
  });
  
  // Esc key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModals();
    }
  });
}

/* --- Form Submissions --- */
function initForms() {
  const contactForm = document.getElementById('contact-form');
  const inlineLeadForms = document.querySelectorAll('.inline-lead-form');
  const modalLeadForm = document.getElementById('modal-lead-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.querySelector('[name="name"]').value;
      showToast(`✉️ Message sent successfully! Thank you, ${name}. We'll respond within 24 hours.`);
      contactForm.reset();
    });
  }
  
  inlineLeadForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = form.querySelector('[type="email"]').value;
      showToast(`📚 Success! We have sent the resources to ${email}. Check your inbox!`);
      form.reset();
    });
  });
  
  if (modalLeadForm) {
    modalLeadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = modalLeadForm.querySelector('[type="email"]').value;
      const resource = document.getElementById('lead-resource-name')?.value || 'resource';
      showToast(`📚 Success! Sent the ${resource} to ${email}.`);
      modalLeadForm.reset();
      closeModals();
    });
  }
}

/* --- Toast Notifications --- */
function showToast(message) {
  // Check if toast element exists, otherwise create it
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.classList.add('toast');
    const icon = document.createElement('span');
    icon.classList.add('toast-icon');
    icon.textContent = '✓';
    const text = document.createElement('span');
    text.classList.add('toast-text');
    toast.appendChild(icon);
    toast.appendChild(text);
    document.body.appendChild(toast);
  }
  
  toast.querySelector('.toast-text').textContent = message;
  toast.classList.add('active');
  
  setTimeout(() => {
    toast.classList.remove('active');
  }, 4000);
}
