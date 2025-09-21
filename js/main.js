/* global gtag */
// ===== MAIN JAVASCRIPT ===== 

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
    initializeThankYouPopup();
});

// ===== INITIALIZE WEBSITE ===== 
function initializeWebsite() {
    hideLoadingScreen();
    initializeHeader();
    initializeMobileMenu();
    initializeScrollAnimations();
    initializeTestimonialCarousel();
    initializeContactForm();
    // Removed floating elements initialization
    initializeExitIntent();
    initializeSmoothScroll();
    // initializeChatbot(); // Chatbot temporarily disabled
}

// ===== LOADING SCREEN ===== 
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1500);
}

// ===== HEADER FUNCTIONALITY ===== 
function initializeHeader() {
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ===== MOBILE MENU ===== 
function initializeMobileMenu() {
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (!mobileToggle || !navMenu) return;
    
    // Set initial ARIA attributes
    mobileToggle.setAttribute('aria-expanded', 'false');
    
    mobileToggle.addEventListener('click', () => {
        const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
        
        // Toggle classes and ARIA attributes
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        mobileToggle.setAttribute('aria-expanded', !isExpanded);
        
        // Trap focus when menu is open
        if (!isExpanded) {
            trapFocus(navMenu);
        } else {
            removeFocusTrap();
        }
    });
    
    // Close menu when clicking on a link
    navMenu.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            closeMenu();
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
            closeMenu();
        }
    });
    
    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
            mobileToggle.focus(); // Return focus to toggle button
        }
    });
    
    function closeMenu() {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        removeFocusTrap();
    }
    
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        if (firstFocusable) firstFocusable.focus();
        
        element.addEventListener('keydown', handleFocusTrap);
        
        function handleFocusTrap(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        }
        
        element._focusTrapHandler = handleFocusTrap;
    }
    
    function removeFocusTrap() {
        if (navMenu._focusTrapHandler) {
            navMenu.removeEventListener('keydown', navMenu._focusTrapHandler);
            delete navMenu._focusTrapHandler;
        }
    }
}

// ===== SMOOTH SCROLL ===== 
function initializeSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== SCROLL ANIMATIONS ===== 
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .feature-box, .about-content, .testimonial-slide');
    animatedElements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

// ===== TESTIMONIAL CAROUSEL ===== 
function initializeTestimonialCarousel() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Show current slide
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    // Add click event to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
    
    // Auto-advance carousel
    setInterval(nextSlide, 5000);
    
    // Initialize first slide
    showSlide(0);
}

// ===== CONTACT FORM ===== 
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    const phoneInput = document.getElementById('phone');
    const scheduleBtn = document.querySelector('.schedule-btn');
    
    // Phone number formatting
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 6) {
            value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
        } else if (value.length >= 3) {
            value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        }
        e.target.value = value;
    });
    
    // Add touch tracking for all form fields
    const formFields = form.querySelectorAll('input, select, textarea');
    formFields.forEach(field => {
        field.addEventListener('blur', () => {
            field.classList.add('touched');
        });
        
        field.addEventListener('focus', () => {
            // Remove error class when user starts typing again
            field.classList.remove('error');
        });
    });
    
    // Handle schedule estimate button click
    if (scheduleBtn) {
        scheduleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Add submitted class to enable validation styling
            form.classList.add('submitted');
            
            if (validateForm()) {
                // Collect form data
                const formData = collectFormData();
                
                // Store data in sessionStorage for the scheduling page
                sessionStorage.setItem('customerData', JSON.stringify(formData));
                
                // Redirect to schedule page
                window.location.href = 'schedule-estimate.html';
            } else {
                showErrorMessage('Please fill in all required fields before scheduling your estimate.');
            }
        });
    }
    
    // Form validation and submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Add submitted class to enable validation styling
        form.classList.add('submitted');
        
        if (validateForm()) {
            showSuccessMessage();
            form.reset();
            // Remove submitted class after successful submission
            form.classList.remove('submitted');
            // Remove touched classes from all fields
            formFields.forEach(field => {
                field.classList.remove('touched');
            });
        }
    });
    
    function collectFormData() {
        const firstName = document.getElementById('first-name').value.trim();
        const lastName = document.getElementById('last-name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const address = document.getElementById('address').value.trim();
        const city = document.getElementById('city').value.trim();
        const state = document.getElementById('state').value;
        const zip = document.getElementById('zip').value.trim();
        const hearAbout = document.getElementById('hear-about').value;
        const message = document.getElementById('message').value.trim();
        
        return {
            firstName,
            lastName,
            email,
            phone,
            address,
            city,
            state,
            zip,
            hearAbout,
            message,
            fullName: `${firstName} ${lastName}`,
            fullAddress: `${address}, ${city}, ${state} ${zip}`
        };
    }
    
    function validateForm() {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            const value = field.value.trim();
            
            // Remove previous error styling
            field.classList.remove('error');
            
            // Check if field is empty
            if (!value) {
                field.classList.add('error');
                isValid = false;
                return;
            }
            
            // Validate email
            if (field.type === 'email' && !isValidEmail(value)) {
                field.classList.add('error');
                isValid = false;
                return;
            }
            
            // Validate phone
            if (field.type === 'tel' && !isValidPhone(value)) {
                field.classList.add('error');
                isValid = false;
                return;
            }
        });
        
        if (!isValid) {
            showErrorMessage('Please fill in all required fields correctly.');
        }
        
        return isValid;
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function isValidPhone(phone) {
        const phoneRegex = /^\(\d{3}\)\s\d{3}-\d{4}$/;
        return phoneRegex.test(phone);
    }
    
    function showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'success-message';
        message.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <h3>Thank You!</h3>
                <p>Your message has been sent successfully. We'll contact you soon!</p>
            </div>
        `;
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
    
    function showErrorMessage(text) {
        const message = document.createElement('div');
        message.className = 'error-message';
        message.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${text}</p>
            </div>
        `;
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
}

// ===== EXIT INTENT POPUP ===== 
function initializeExitIntent() {
    const exitPopup = document.getElementById('exit-popup');
    const closeBtn = document.querySelector('.exit-popup-close');
    let hasShownPopup = false;
    let userEngaged = false;
    const minTimeOnPage = 10000; // Minimum 10 seconds on page before showing popup
    const pageLoadTime = Date.now();
    
    if (!exitPopup || !closeBtn) return;
    
    // Track user engagement
    function trackEngagement() {
        userEngaged = true;
    }
    
    // Add engagement tracking
    document.addEventListener('scroll', trackEngagement, { once: true });
    document.addEventListener('mouseenter', trackEngagement, { once: true });
    document.addEventListener('click', trackEngagement, { once: true });
    
    // Show popup on mouse leave (desktop only) - but only if user has been engaged
    if (window.innerWidth > 767) {
        document.addEventListener('mouseleave', (e) => {
            const timeOnPage = Date.now() - pageLoadTime;
            
            // Only show if:
            // 1. Mouse leaves from top of viewport (actually leaving page)
            // 2. User has been on page for minimum time
            // 3. User has engaged with the page
            // 4. Haven't shown popup already
            if (e.clientY <= 0 && 
                !hasShownPopup && 
                userEngaged && 
                timeOnPage >= minTimeOnPage) {
                showExitPopup();
            }
        });
    }
    
    // Show popup after longer time on mobile (only if engaged)
    if (window.innerWidth <= 767) {
        setTimeout(() => {
            const timeOnPage = Date.now() - pageLoadTime;
            if (!hasShownPopup && userEngaged && timeOnPage >= 60000) { // 60 seconds minimum on mobile
                showExitPopup();
            }
        }, 60000); // Check after 60 seconds
    }
    
    function showExitPopup() {
        exitPopup.classList.add('show');
        hasShownPopup = true;
        
        // Hide popup after 15 seconds if no interaction
        setTimeout(() => {
            if (exitPopup.classList.contains('show')) {
                hideExitPopup();
            }
        }, 15000);
    }
    
    function hideExitPopup() {
        exitPopup.classList.remove('show');
    }
    
    // Close popup events
    closeBtn.addEventListener('click', hideExitPopup);
    exitPopup.addEventListener('click', (e) => {
        if (e.target === exitPopup) {
            hideExitPopup();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && exitPopup.classList.contains('show')) {
            hideExitPopup();
        }
    });
}

// ===== THANK YOU POPUP ===== 
function initializeThankYouPopup() {
    const popup = document.getElementById('thank-you-popup');
    const closeBtn = document.querySelector('.thank-you-close');
    
    if (!popup) return;
    
    // Show popup automatically after page loads
    setTimeout(() => {
        popup.classList.add('show');
    }, 500);
    
    // Close popup functionality
    function closePopup() {
        popup.classList.remove('show');
    }
    
    // Close on button click
    if (closeBtn) {
        closeBtn.addEventListener('click', closePopup);
    }
    
    // Close on overlay click
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            closePopup();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popup.classList.contains('show')) {
            closePopup();
        }
    });
}

// ===== CHATBOT FUNCTIONALITY ===== 
function initializeChatbot() {
    const chatbot = document.getElementById('chatbot');
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatClose = document.getElementById('chat-close');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatMessages = document.getElementById('chatbot-messages');
    const quickActions = document.querySelectorAll('.quick-action');
    const chatNotification = document.getElementById('chat-notification');
    let isOpen = false;

    // Toggle chatbot
    chatbotToggle.addEventListener('click', toggleChatbot);
    chatClose.addEventListener('click', closeChatbot);
    
    // Input handling
    chatInput.addEventListener('input', handleInputChange);
    chatInput.addEventListener('keypress', handleKeyPress);
    chatSend.addEventListener('click', sendMessage);
    
    // Quick actions
    quickActions.forEach(action => {
        action.addEventListener('click', () => {
            const message = action.dataset.message;
            sendUserMessage(message);
        });
    });
    
    // Auto-show notification after 5 seconds
    setTimeout(() => {
        if (!isOpen) {
            chatNotification.style.display = 'flex';
            chatbotToggle.style.animation = 'chatbotPulse 1s infinite';
        }
    }, 5000);
    
    function toggleChatbot() {
        if (isOpen) {
            closeChatbot();
        } else {
            openChatbot();
        }
    }
    
    function openChatbot() {
        chatbotContainer.classList.add('active');
        isOpen = true;
        chatNotification.style.display = 'none';
        chatbotToggle.style.animation = '';
        chatInput.focus();
        
        // Track chatbot open
        trackEvent('Chatbot', 'Open', 'Toggle Button');
    }
    
    function closeChatbot() {
        chatbotContainer.classList.remove('active');
        isOpen = false;
        
        // Track chatbot close
        trackEvent('Chatbot', 'Close', 'Close Button');
    }
    
    function handleInputChange() {
        const hasText = chatInput.value.trim().length > 0;
        chatSend.disabled = !hasText;
    }
    
    function handleKeyPress(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!chatSend.disabled) {
                sendMessage();
            }
        }
    }
    
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        sendUserMessage(message);
        chatInput.value = '';
        chatSend.disabled = true;
    }
    
    function sendUserMessage(message) {
        // Add user message to chat
        addMessage(message, 'user');
        
        // Show typing indicator
        showTypingIndicator();
        
        // Simulate bot response after delay
        setTimeout(() => {
            hideTypingIndicator();
            const botResponse = generateBotResponse(message);
            addMessage(botResponse, 'bot');
        }, 1000 + Math.random() * 1000); // 1-2 second delay
        
        // Track message
        trackEvent('Chatbot', 'Message Sent', 'User Message');
    }
    
    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = type === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        const messageParagraph = document.createElement('p');
        messageParagraph.textContent = text;
        
        const time = document.createElement('span');
        time.className = 'message-time';
        time.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        content.appendChild(messageParagraph);
        content.appendChild(time);
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-message';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function hideTypingIndicator() {
        const typingMessage = chatMessages.querySelector('.typing-message');
        if (typingMessage) {
            typingMessage.remove();
        }
    }
    
    function generateBotResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Response patterns
        if (message.includes('estimate') || message.includes('quote') || message.includes('price')) {
            return "I'd be happy to help you get a free estimate! You can fill out our contact form on this page, or call us directly at 1-800-297-9878. What type of project are you considering?";
        }
        
        if (message.includes('roofing') || message.includes('roof')) {
            return "We specialize in all types of roofing services including repairs, replacements, and storm damage assessment. We're licensed and insured with quality materials and warranties. Would you like to schedule an inspection?";
        }
        
        if (message.includes('emergency') || message.includes('urgent') || message.includes('leak')) {
            return "We offer 24/7 emergency roofing services! For immediate assistance, please call us at 1-800-297-9878. Our team can respond quickly to urgent situations like roof leaks or storm damage.";
        }
        
        if (message.includes('services') || message.includes('what do you')) {
            return "We offer comprehensive home improvement services including roofing, windows, gutters, siding, painting, carpentry, and interior remodeling. We serve Northern Virginia, DC, and Maryland. What specific service interests you?";
        }
        
        if (message.includes('area') || message.includes('location') || message.includes('where')) {
            return "We proudly serve Northern Virginia, Washington DC, and Maryland. We're a family-owned business operating since 2020 with proper licensing (VA: 2705180039, MHIC: 163621). Are you located in our service area?";
        }
        
        if (message.includes('licensed') || message.includes('insured') || message.includes('license')) {
            return "Yes, we're fully licensed and insured! Our licenses are VA: 2705180039 and MHIC: 163621. We also maintain comprehensive insurance coverage to protect both our workers and your property.";
        }
        
        if (message.includes('contact') || message.includes('phone') || message.includes('call')) {
            return "You can reach us at 1-800-297-9878 or email info@yvrroofing.com. We're available 24/7 for emergencies and typically respond to estimates within 24 hours. What's the best way to contact you?";
        }
        
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return "Hello! Welcome to Your Vision Roofing. I'm here to help answer questions about our roofing and home improvement services. How can I assist you today?";
        }
        
        if (message.includes('thank') || message.includes('thanks')) {
            return "You're very welcome! Is there anything else I can help you with regarding our roofing or home improvement services?";
        }
        
        if (message.includes('cost') || message.includes('how much') || message.includes('expensive')) {
            return "Costs vary depending on the scope and materials of your project. We offer free, no-obligation estimates to provide accurate pricing. Would you like to schedule an estimate or learn more about a specific service?";
        }
        
        // Default response
        return "Thanks for your question! For detailed information about our services, I'd recommend speaking with one of our specialists. You can call us at 1-800-297-9878 or fill out our contact form for a free estimate. How else can I help you today?";
    }
    
    // Close chatbot when clicking outside
    document.addEventListener('click', (e) => {
        if (isOpen && !chatbot.contains(e.target)) {
            closeChatbot();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen) {
            closeChatbot();
        }
    });
}

// Expose for future manual use to avoid unused warning
window.initializeChatbot = initializeChatbot;

// ===== ANALYTICS AND TRACKING ===== 

// Track user interactions
function trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, { event_category: category, event_label: label });
    }
}

// Add phone call tracking to phone links
document.addEventListener('DOMContentLoaded', () => {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', trackPhoneCall);
    });
});

// Track phone calls
function trackPhoneCall() {
    trackEvent('Contact', 'Phone Call', 'Header Phone');
}

// ===== ADDITIONAL STYLES FOR DYNAMIC ELEMENTS ===== 

// Add styles for success/error messages
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    .success-message, .error-message {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    }
    
    .success-message {
        background-color: #d4edda;
        border: 1px solid #c3e6cb;
        color: #155724;
    }
    
    .error-message {
        background-color: #f8d7da;
        border: 1px solid #f5c6cb;
        color: #721c24;
    }
    
    .success-content, .error-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .success-content i {
        color: #28a745;
        font-size: 1.2rem;
    }
    
    .error-content i {
        color: #dc3545;
        font-size: 1.2rem;
    }
    
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #dc3545;
        box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
    }
    
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @media (max-width: 767px) {
        .success-message, .error-message {
            top: 10px;
            right: 10px;
            left: 10px;
            max-width: none;
        }
    }
`;

document.head.appendChild(dynamicStyles);

// ===== RESTORED UTILITY INITIALIZERS (previously removed) =====
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    if (!images.length) return;
    if (!('IntersectionObserver' in window)) {
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.classList.remove('lazy');
            }
        });
        return;
    }
    const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    img.removeAttribute('data-src');
                }
                obs.unobserve(img);
            }
        });
    });
    images.forEach(img => io.observe(img));
}

function preloadCriticalResources() {
    ['Assets/Images/Final-logo.png','Assets/Images/yvr-completed-banner.png']
        .forEach(src => { const img = new Image(); img.src = src; });
}

function initializeKeyboardNavigation() {
    const focusable = document.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    focusable.forEach(el => {
        el.addEventListener('keydown', e => {
            if ((e.key === 'Enter' || e.key === ' ') && (el.tagName === 'A' || el.tagName === 'BUTTON')) {
                e.preventDefault();
                el.click();
            }
        });
    });
}
// ===== END RESTORED UTILITY INITIALIZERS =====

// Initialize keyboard navigation and lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeKeyboardNavigation();
    initializeLazyLoading();
    preloadCriticalResources();
});