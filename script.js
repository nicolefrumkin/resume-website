/**
 * Nicole Frumkin Portfolio - Main JavaScript
 * ==========================================
 * This file contains all the interactive functionality for the portfolio website.
 */

document.addEventListener("DOMContentLoaded", function () {
    // Initialize global variables
    const navbar = document.getElementById("mainNav");
    const darkModeToggle = document.getElementById("darkModeToggle");
    const icon = darkModeToggle ? darkModeToggle.querySelector("i") : null;
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    
    /**
     * Animation On Scroll (AOS) Initialization
     * ----------------------------------------
     * Initialize the AOS library with custom settings
     */
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: "ease-in-out",
        once: true,
        mirror: false,
        disable: window.innerWidth < 768 // Disable on mobile for better performance
      });
    }
  
    /**
     * Smooth Scrolling
     * ---------------
     * Add smooth scrolling behavior to anchor links
     */
    const setupSmoothScrolling = () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          
          // Skip empty links
          if (this.getAttribute('href') === '#') return;
          
          const targetId = this.getAttribute('href');
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
            const navHeight = navbar ? navbar.offsetHeight : 0;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
            
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(link => {
              link.classList.remove('active');
            });
            this.classList.add('active');
          }
        });
      });
    };
  
    /**
     * Sticky Navbar
     * ------------
     * Make the navbar sticky on scroll
     */
    const setupStickyNavbar = () => {
      if (!navbar || !document.querySelector('.hero')) return;
      
      const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting && window.scrollY > 50) {
            navbar.classList.add("navbar-sticky");
          } else {
            navbar.classList.remove("navbar-sticky");
          }
        });
      }, {
        rootMargin: "-50px 0px 0px 0px"
      });
      
      navObserver.observe(document.querySelector('.hero'));
    };
  
    /**
     * Dark Mode Toggle
     * ---------------
     * Handle dark mode functionality with localStorage persistence
     */
    const setupDarkMode = () => {
      if (!darkModeToggle || !icon) return;
      
      // Check if user previously enabled dark mode or prefers dark scheme
      if (localStorage.getItem("darkMode") === "enabled" || 
          (localStorage.getItem("darkMode") === null && prefersDarkScheme.matches)) {
        enableDarkMode();
      }
  
      darkModeToggle.addEventListener("click", toggleDarkMode);
  
      // Responsive check for dark mode preference changes
      prefersDarkScheme.addEventListener("change", handleSystemThemeChange);
    };
  
    // Enable dark mode
    const enableDarkMode = () => {
      document.body.classList.add("dark-mode-body");
      document.documentElement.classList.add("dark-mode");
      if (icon) {
        icon.classList.remove("bi-moon-fill");
        icon.classList.add("bi-sun-fill");
      }
      if (darkModeToggle) {
        darkModeToggle.setAttribute("aria-label", "Switch to light mode");
      }
      localStorage.setItem("darkMode", "enabled");
    };
  
    // Disable dark mode
    const disableDarkMode = () => {
      document.body.classList.remove("dark-mode-body");
      document.documentElement.classList.remove("dark-mode");
      if (icon) {
        icon.classList.remove("bi-sun-fill");
        icon.classList.add("bi-moon-fill");
      }
      if (darkModeToggle) {
        darkModeToggle.setAttribute("aria-label", "Switch to dark mode");
      }
      localStorage.setItem("darkMode", "disabled");
    };
  
    // Toggle dark mode
    const toggleDarkMode = () => {
      if (document.documentElement.classList.contains("dark-mode")) {
        disableDarkMode();
      } else {
        enableDarkMode();
      }
    };
  
    // Handle system theme change
    const handleSystemThemeChange = (e) => {
      if (localStorage.getItem("darkMode") === null) {
        if (e.matches) {
          enableDarkMode();
        } else {
          disableDarkMode();
        }
      }
    };
  
    /**
     * Skill Bar Animations
     * -------------------
     * Animate skill bars when they come into view
     */
    const setupSkillBars = () => {
      const skillBars = document.querySelectorAll(".skill-progress");
      const skillSection = document.getElementById("skills");
      
      if (!skillBars.length || !skillSection) return;
  
      // Set initial width to 0
      skillBars.forEach(bar => {
        bar.style.width = "0";
      });
  
      // Create observer for skill bars animation
      const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate skill bars when in viewport
            skillBars.forEach((bar) => {
              const width = bar.getAttribute("data-width");
              setTimeout(() => {
                bar.style.width = width;
              }, 200); // Small delay for better visual effect
            });
            skillObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.2
      });
  
      skillObserver.observe(skillSection);
    };
  
    /**
     * Active Navigation Update
     * -----------------------
     * Update active navigation item based on scroll position
     */
    const setupActiveNavigation = () => {
      const sections = document.querySelectorAll("section[id]");
      const navLinks = document.querySelectorAll(".nav-link");
      
      if (!sections.length || !navLinks.length) return;
      
      const updateActiveNav = () => {
        let current = "";
        const navHeight = navbar ? navbar.offsetHeight : 0;
        
        sections.forEach((section) => {
          const sectionTop = section.offsetTop - navHeight - 100;
          const sectionHeight = section.offsetHeight;
          
          if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute("id");
          }
        });
        
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${current}`) {
            link.classList.add("active");
          } else if (current === "" && link.getAttribute("href") === "#") {
            link.classList.add("active");
          }
        });
      };
      
      window.addEventListener("scroll", updateActiveNav);
      // Run once on load
      updateActiveNav();
    };
  
    /**
     * Contact Form Handling
     * -------------------
     * Handle form submissions for the contact page
     */
    const setupContactForm = () => {
      const contactForm = document.getElementById('contactForm');
      if (!contactForm) return;
      
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // In a real implementation, you would send the form data to a server
        // For now, we'll just show a success modal if it exists
        const successModal = document.getElementById('successModal');
        if (successModal && typeof bootstrap !== 'undefined') {
          const modal = new bootstrap.Modal(successModal);
          modal.show();
        }
        
        // Reset the form
        contactForm.reset();
      });
    };
    
    // Initialize all functionality
    setupSmoothScrolling();
    setupStickyNavbar();
    setupDarkMode();
    setupSkillBars();
    setupActiveNavigation();
    setupContactForm();
  });