// Anand Restaurant JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // Initialize all functionality
  initNavigation()
  initGalleryFilter()
  initImageModal()
  initContactForm()
  initReservationForm()
  initScrollAnimations()
})

// Navigation functionality
function initNavigation() {
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  //slick slider initialization

  $(document).ready(function(){
    $('.slick-slider').slick({
     slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  dots: true,
  arrows: true,
  infinite: true,
  speed: 500,
  pauseOnHover: true,
      responsive: [
        {
          breakpoint: 768, // tablets
          settings: {
            slidesToShow: 2
          }
        },
        {
          breakpoint: 576, // phones
          settings: {
            slidesToShow: 1
          }
        }
      ]
    });
  });



  // Active navigation highlighting
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link")
  const currentPage = window.location.pathname.split("/").pop() || "index.html"

  navLinks.forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active")
    } else {
      link.classList.remove("active")
    }
  })
}

// Gallery filter functionality
function initGalleryFilter() {
  const filterButtons = document.querySelectorAll("[data-filter]")
  const galleryItems = document.querySelectorAll(".gallery-item")

  if (filterButtons.length === 0) return

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter")

      // Update active button
      filterButtons.forEach((btn) => btn.classList.remove("active"))
      this.classList.add("active")

      // Filter gallery items
      galleryItems.forEach((item) => {
        const category = item.getAttribute("data-category")

        if (filter === "all" || category === filter) {
          item.style.display = "block"
          setTimeout(() => {
            item.classList.remove("hidden")
          }, 10)
        } else {
          item.classList.add("hidden")
          setTimeout(() => {
            item.style.display = "none"
          }, 300)
        }
      })
    })
  })
}

// Image modal functionality
function initImageModal() {
  const imageModal = document.getElementById("imageModal")
  if (!imageModal) return

  const modalImage = document.getElementById("modalImage")
  const modalTitle = document.getElementById("imageModalLabel")

  document.querySelectorAll('[data-bs-toggle="modal"][data-bs-target="#imageModal"]').forEach((trigger) => {
    trigger.addEventListener("click", function () {
      const imageSrc = this.getAttribute("data-bs-image")
      const imageTitle = this.getAttribute("data-bs-title")
      const imageAlt = this.getAttribute("alt")

      if (modalImage && imageSrc) {
        modalImage.src = imageSrc
        modalImage.alt = imageAlt || imageTitle || "Gallery Image"
      }

      if (modalTitle && imageTitle) {
        modalTitle.textContent = imageTitle
      }
    })
  })
}

// Contact form functionality
function initContactForm() {
  const contactForm = document.getElementById("contactForm")
  if (!contactForm) return

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault()

    // Get form data
    const formData = new FormData(this)
    const data = Object.fromEntries(formData)

    // Validate form
    if (!validateContactForm(data)) {
      return
    }

    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]')
    const originalText = submitBtn.innerHTML
    submitBtn.innerHTML = '<span class="loading"></span> Sending...'
    submitBtn.disabled = true

    // Simulate form submission
    setTimeout(() => {
      showAlert("success", "Thank you for your message! We will get back to you soon.")
      contactForm.reset()
      submitBtn.innerHTML = originalText
      submitBtn.disabled = false
    }, 2000)
  })
}

// Reservation form functionality
function initReservationForm() {
  const reservationForm = document.getElementById("reservationForm")
  if (!reservationForm) return

  // Set minimum date to today
  const dateInput = document.getElementById("resDate")
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0]
    dateInput.min = today
  }

  reservationForm.addEventListener("submit", function (e) {
    e.preventDefault()

    // Get form data
    const formData = new FormData(this)
    const data = Object.fromEntries(formData)

    // Validate form
    if (!validateReservationForm(data)) {
      return
    }

    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]')
    const originalText = submitBtn.innerHTML
    submitBtn.innerHTML = '<span class="loading"></span> Confirming...'
    submitBtn.disabled = true

    // Simulate reservation submission
    setTimeout(() => {
      showAlert("success", "Reservation confirmed! We will call you to confirm the details.")
      reservationForm.reset()
      submitBtn.innerHTML = originalText
      submitBtn.disabled = false

      // Close modal
      const modal = window.bootstrap.Modal.getInstance(document.getElementById("reservationModal"))
      if (modal) {
        modal.hide()
      }
    }, 2000)
  })
}

// Form validation functions
function validateContactForm(data) {
  const required = ["firstName", "lastName", "email", "subject", "message"]

  for (const field of required) {
    if (!data[field] || data[field].trim() === "") {
      showAlert("error", `Please fill in the ${field.replace(/([A-Z])/g, " $1").toLowerCase()} field.`)
      return false
    }
  }

  if (!isValidEmail(data.email)) {
    showAlert("error", "Please enter a valid email address.")
    return false
  }

  return true
}

function validateReservationForm(data) {
  const required = ["resName", "resPhone", "resDate", "resTime", "resGuests"]

  for (const field of required) {
    if (!data[field] || data[field].trim() === "") {
      showAlert("error", "Please fill in all required fields.")
      return false
    }
  }

  // Validate date is not in the past
  const selectedDate = new Date(data.resDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (selectedDate < today) {
    showAlert("error", "Please select a future date.")
    return false
  }

  return true
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Alert system
function showAlert(type, message) {
  // Remove existing alerts
  const existingAlerts = document.querySelectorAll(".alert")
  existingAlerts.forEach((alert) => alert.remove())

  // Create new alert
  const alertDiv = document.createElement("div")
  alertDiv.className = `alert alert-${type === "error" ? "danger" : type} alert-dismissible fade show`
  alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `

  // Insert alert at the top of the page
  const container = document.querySelector(".container")
  if (container) {
    container.insertBefore(alertDiv, container.firstChild)
  }

  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    if (alertDiv.parentNode) {
      alertDiv.remove()
    }
  }, 5000)

  // Scroll to alert
  alertDiv.scrollIntoView({ behavior: "smooth", block: "center" })
}

// Scroll animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in-up")
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  // Observe elements for animation
  const animateElements = document.querySelectorAll(".card, .feature-icon, .value-icon")
  animateElements.forEach((el) => observer.observe(el))
}

// Utility functions
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Menu item interactions
document.addEventListener("click", (e) => {
  if (e.target.matches(".btn-outline-primary") && e.target.textContent.includes("Order Now")) {
    e.preventDefault()
    showAlert("info", "Online ordering coming soon! Please call us to place your order.")
  }
})


let allMenuItems = [];

// 1. Fetch all menu items from backend

const API_BASE_URL = window.location.hostname.includes("localhost")
  ? "http://localhost:5000" // Local backend
  : "https://tumhara-backend-url"; // Deployed backend ka URL

function fetchMenu() {
  fetch(`${API_BASE_URL}/api/menuItem/all`)
    .then(res => res.json())
    .then(data => {
      allMenuItems = data;
      displayItems(allMenuItems);
    })
    .catch(err => console.error("Error fetching menu:", err));
}


// 2. Display items on the page
function displayItems(items) {
  const container = document.getElementById('menuContainer');
  container.innerHTML = items.map((item, index) => `
    <div class="col-md-4 col-lg-3">
      <div class="card h-100 shadow" data-index="${index}">
        <img src="${item.image}" class="card-img-top" alt="${item.name}" style="height:150px; object-fit:cover;">
        <div class="card-body">
          <h5 class="card-title mb-0">${item.name}</h5>
          
          <p class="text-muted d-inline mb-0">₹<strike>${item.price}</strike></p>
          <p class="fw-bold text-primary d-inline mb-0">₹${item.offerprice}</p>
          <p class="text-danger d-inline mb-0">(up to ${item.offer}% off)</p>
          <p class="badge mb-0 bg-${item.category === 'Veg' ? 'success' : 'danger'}">${item.category}</p></br>

        </div>
      </div>
    </div>
  `).join('');

  // Card click for details
  container.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const idx = card.getAttribute('data-index');
      showDetails(allMenuItems[idx]);
    });
  });

  // Stop propagation for detail button
  container.querySelectorAll('button[data-index]').forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = button.getAttribute('data-index');
      showDetails(allMenuItems[idx]);
    });
  });
}

// 3. Filter items + highlight active button
function filterItems(filter, clickedButton) {
  // Remove active from all buttons
  document.querySelectorAll('#filterButtons button').forEach(btn => {
    btn.classList.remove('active');
  });

  // Add active to clicked button
  clickedButton.classList.add('active');

  // Filter logic
  if (filter === 'All') {
    displayItems(allMenuItems);
  } else {
    const filtered = allMenuItems.filter(item =>
      item.category === filter || item.cuisine === filter
    );
    displayItems(filtered);
  }
}


// 4. Show details in modal
function showDetails(item) {
  const modal = document.getElementById('detailModal');
  const content = document.getElementById('modalContent');

  content.innerHTML = `
 <img src="${item.image}" class="card-img-top" alt="${item.name}" style="height:150px; object-fit:cover;">
    <h2 class="text-danger ">${item.name}</h2>
    <p class='my-0'>${item.description}</p>
     <p class="text-muted d-inline my-0">₹<strike>${item.price}</strike></p>
          <p class="fw-bold text-primary d-inline mb-0">₹${item.offerprice}</p>
     <p class="text-danger d-inline mb-0">(up to ${item.offer}% off)</p></br>
          <p class="text-muted d-inline mb-0">Available in ${item.quantity} quantity</p><br>
          <p class="badge mb-0 bg-${item.category === 'Veg' ? 'success' : 'danger'}">${item.category}</p>
          <p class="text-muted d-inline small">${item.cuisine}</p>
    
  `;

  modal.style.display = 'block';
}

// 5. Close modal
function closeModal() {
  document.getElementById('detailModal').style.display = 'none';
}

// 6. Setup filter button events
function setupFilterButtons() {
  const buttons = document.querySelectorAll('#filterButtons button');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterItems(btn.textContent.trim(), btn);
    });
  });
}

// 7. On page load
window.onload = function () {
  fetchMenu();
  setupFilterButtons();
};



// 3. Filter function
function filterItems(filter, clickedButton) {
    // 1️⃣ Pehle sab buttons se active class hatao
  const buttons = document.querySelectorAll('.menu button');
  buttons.forEach(btn => btn.classList.remove('active'));

  // 2️⃣ Jis button pe click hua, uspe active class lagao
  clickedButton.classList.add('active');

  if (filter === 'All') {
    displayItems(allMenuItems);
  } else {
    const filtered = allMenuItems.filter(item => 
      item.category === filter || item.cuisine === filter
      
    );
    displayItems(filtered);
  }
}




// Navbar collapse on mobile after clicking a link
document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    const navbarCollapse = document.querySelector(".navbar-collapse")
    if (navbarCollapse.classList.contains("show")) {
      const bsCollapse = new window.bootstrap.Collapse(navbarCollapse)
      bsCollapse.hide()
    }
  })
})

// Loading screen (if needed)
window.addEventListener("load", () => {
  const loader = document.querySelector(".loader")
  if (loader) {
    loader.style.display = "none"
  }
})

// Enhanced animations and interactions
function initEnhancedAnimations() {
  // Floating food animation
  createFloatingFood()

  // Parallax effect for hero section
  initParallaxEffect()

  // Counter animation for stats
  initCounterAnimation()

  // Enhanced hover effects
  initEnhancedHovers()
}

// Create floating food elements
function createFloatingFood() {
  const foodEmojis = ["🍛", "🍜", "🥘", "🍲", "🍝", "🥗"]

  setInterval(() => {
    if (window.innerWidth > 768) {
      // Only on desktop
      const food = document.createElement("div")
      food.className = "floating-food"
      food.textContent = foodEmojis[Math.floor(Math.random() * foodEmojis.length)]
      food.style.left = Math.random() * 100 + "%"
      food.style.top = Math.random() * 100 + "%"
      food.style.animationDuration = Math.random() * 3 + 4 + "s"

      document.body.appendChild(food)

      setTimeout(() => {
        if (food.parentNode) {
          food.remove()
        }
      }, 8000)
    }
  }, 3000)
}

// Parallax effect
function initParallaxEffect() {
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const heroSection = document.querySelector(".hero-section")

    if (heroSection) {
      heroSection.style.transform = `translateY(${scrolled * 0.5}px)`
    }
  })
}

// Counter animation
function initCounterAnimation() {
  const counters = document.querySelectorAll(".stat-number")
  const observerOptions = {
    threshold: 0.7,
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target
        const target = Number.parseInt(counter.textContent.replace(/\D/g, ""))
        const suffix = counter.textContent.replace(/[0-9]/g, "")

        animateCounter(counter, target, suffix)
        observer.unobserve(counter)
      }
    })
  }, observerOptions)

  counters.forEach((counter) => observer.observe(counter))
}

function animateCounter(element, target, suffix) {
  let current = 0
  const increment = target / 100
  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      element.textContent = target + suffix
      clearInterval(timer)
    } else {
      element.textContent = Math.floor(current) + suffix
    }
  }, 20)
}

// Enhanced hover effects
function initEnhancedHovers() {
  // Card tilt effect
  const cards = document.querySelectorAll(".card")
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const rotateX = (y - centerY) / 10
      const rotateY = (centerX - x) / 10

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`
    })

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateZ(0)"
    })
  })

  // Button ripple effect
  const buttons = document.querySelectorAll(".btn")
  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const ripple = document.createElement("span")
      const rect = this.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      ripple.style.width = ripple.style.height = size + "px"
      ripple.style.left = x + "px"
      ripple.style.top = y + "px"
      ripple.classList.add("ripple")

      this.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 600)
    })
  })
}

// Newsletter subscription
function initNewsletterSubscription() {
  const newsletterForm = document.querySelector("section.bg-primary form")
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault()
      const email = this.querySelector('input[type="email"]').value

      if (isValidEmail(email)) {
        showAlert("success", "Thank you for subscribing! You will receive our latest updates.")
        this.reset()
      } else {
        showAlert("error", "Please enter a valid email address.")
      }
    })
  }
}

// Initialize all enhanced features
document.addEventListener("DOMContentLoaded", () => {
  initNavigation()
  initGalleryFilter()
  initImageModal()
  initContactForm()
  initReservationForm()
  initScrollAnimations()
  initEnhancedAnimations()
  initNewsletterSubscription()
})

// Add CSS for ripple effect
const rippleCSS = `
.btn {
  position: relative;
  overflow: hidden;
}

.ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  transform: scale(0);
  animation: ripple-animation 0.6s linear;
  pointer-events: none;
}

@keyframes ripple-animation {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
`

const style = document.createElement("style")
style.textContent = rippleCSS
document.head.appendChild(style)
