// Google Apps Script URL (use your deployed URL)
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwoIPAccBuRcI0MOfNgPENmSK-E4TtKikKc4n_CPIJIX65tQVCw8L87qCeLy3tIDA_F/exec';

// DOM Elements
const nameModal = document.getElementById('nameModal');
const nameForm = document.getElementById('nameForm');
const nameInput = document.getElementById('nameInput');
const friendName = document.getElementById('friendName');
const botCheck = document.getElementById('botCheck');
const loadingIndicator = document.createElement('div');
loadingIndicator.className = 'loading-indicator';
loadingIndicator.textContent = 'Saving...';
nameForm.appendChild(loadingIndicator);

// Initialize
checkForName();
setupConfetti();
setupScroll();
setupAnimations();

// Check URL for name parameter
function checkForName() {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');
    
    if (name) {
        const sanitizedName = sanitizeInput(decodeURIComponent(name));
        if (sanitizedName.length > 0) {
            friendName.textContent = sanitizedName;
            return true;
        }
    }
    nameModal.style.display = 'flex';
    return false;
}

// Sanitize input
function sanitizeInput(input) {
    return input.replace(/[^a-zA-Z0-9 \-\']/g, '').trim().substring(0, 50);
}

// Save to Google Sheets
async function saveToGoogleSheet(name) {
    // Skip if honeypot field was filled (likely a bot)
    if (botCheck.value) return false;
    
    try {
        loadingIndicator.style.display = 'block';
        
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: name,
                page: window.location.href,
                timestamp: new Date().toISOString()
            })
        });
        
        return await response.text() === 'Success';
    } catch (error) {
        console.error('Save failed:', error);
        return false;
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

// Form submission handler
nameForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = sanitizeInput(nameInput.value);
    if (!name) return;
    
    // Save to Google Sheets
    await saveToGoogleSheet(name);
    
    // Update URL and close modal
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('name', name);
    window.history.pushState({}, '', newUrl);
    
    friendName.textContent = name;
    nameModal.style.display = 'none';
    
    // Show confetti celebration
    createConfetti();
});

// Confetti animation
function setupConfetti() {
    window.addEventListener('load', createConfetti);
}

function createConfetti() {
    const confettiContainer = document.getElementById('confettiContainer');
    const colors = ['#D4AF37', '#0A2463', '#1B998B', '#F8F1E5', '#FFFFFF'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        const size = 5 + Math.random() * 10;
        const delay = Math.random() * 3;
        
        Object.assign(confetti.style, {
            position: 'absolute',
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            left: `${Math.random() * 100}vw`,
            top: '-10px',
            opacity: '0.8',
            transform: `rotate(${Math.random() * 360}deg)`,
            animation: `confettiFall ${3 + Math.random() * 3}s linear ${delay}s forwards`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0'
        });
        
        confettiContainer.appendChild(confetti);
    }
    
    // Play sound if allowed
    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-happy-crowd-cheering-2013.mp3');
    audio.volume = 0.2;
    audio.play().catch(e => console.log("Audio muted"));
    
    setTimeout(() => {
        confettiContainer.innerHTML = '';
    }, 8000);
}

// Scroll to message section
function setupScroll() {
    document.querySelectorAll('.scroll-indicator').forEach(el => {
        el.addEventListener('click', () => {
            document.querySelector('.message-section').scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

// Animate on scroll
function setupAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.message-container, .dua').forEach(el => {
        observer.observe(el);
    });
}
