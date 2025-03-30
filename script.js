// Google Apps Script URL (replace with your deployed web app URL)
const GOOGLE_SCRIPT_URL = 'https://docs.google.com/spreadsheets/d/18v3ve4qzLBtCbjag8nNMInGNIASa8xwxC7U5U1l9Em8/edit?usp=drivesdk';

// DOM Elements
const nameModal = document.getElementById('nameModal');
const nameForm = document.getElementById('nameForm');
const nameInput = document.getElementById('nameInput');
const friendName = document.getElementById('friendName');
const botCheck = document.getElementById('botCheck');

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
    return false;
}

// Sanitize input
function sanitizeInput(input) {
    return input.replace(/[^a-zA-Z0-9 \-\']/g, '').trim();
}

// Save to Google Sheets
async function saveToGoogleSheet(name) {
    try {
        // Skip if honeypot field was filled (likely a bot)
        if (botCheck.value) return false;
        
        const timestamp = new Date().toISOString();
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                timestamp: timestamp,
                page: window.location.href
            })
        });
        
        return response.ok;
    } catch (error) {
        console.error('Error saving to Google Sheet:', error);
        return false;
    }
}

// Form submission handler
nameForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = sanitizeInput(nameInput.value);
    if (!name) return;
    
    // Save to Google Sheets silently (won't await to prevent delay)
    saveToGoogleSheet(name);
    
    // Update URL and close modal
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('name', name);
    window.history.pushState({}, '', newUrl);
    
    friendName.textContent = name;
    nameModal.style.display = 'none';
});

// Show modal if no name in URL
if (!checkForName()) {
    nameModal.style.display = 'flex';
}

// Original confetti animation
function createConfetti() {
    const confettiContainer = document.getElementById('confettiContainer');
    const shapes = ['circle', 'square', 'triangle'];
    const colors = ['#D4AF37', '#0A2463', '#1B998B', '#F8F1E5', '#FFFFFF'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const size = 5 + Math.random() * 10;
        const delay = Math.random() * 3;
        
        confetti.style.position = 'absolute';
        confetti.style.width = size + 'px';
        confetti.style.height = size + 'px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.opacity = '0.8';
        confetti.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
        confetti.style.animationDelay = delay + 's';
        
        if (shape === 'square') {
            confetti.style.borderRadius = '0';
        } else if (shape === 'triangle') {
            confetti.style.width = '0';
            confetti.style.height = '0';
            confetti.style.borderLeft = size/2 + 'px solid transparent';
            confetti.style.borderRight = size/2 + 'px solid transparent';
            confetti.style.borderBottom = size + 'px solid ' + colors[Math.floor(Math.random() * colors.length)];
            confetti.style.backgroundColor = 'transparent';
        } else {
            confetti.style.borderRadius = '50%';
        }
        
        confetti.style.animation = 'confettiFall ' + (3 + Math.random() * 3) + 's linear ' + delay + 's forwards';
        confettiContainer.appendChild(confetti);
    }
    
    // Play celebration sound
    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-happy-crowd-cheering-2013.mp3');
    audio.volume = 0.2;
    audio.play().catch(e => console.log("Audio playback prevented:", e));
}

// Start animations when page loads
window.addEventListener('load', function() {
    createConfetti();
    
    // Remove confetti after some time to prevent performance issues
    setTimeout(() => {
        document.getElementById('confettiContainer').innerHTML = '';
    }, 8000);
});

// Smooth scroll to message section
document.querySelector('.scroll-indicator').addEventListener('click', function() {
    document.querySelector('.message-section').scrollIntoView({ 
        behavior: 'smooth' 
    });
});

// Animate elements when they come into view
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('.message-container, .dua').forEach(el => {
    observer.observe(el);
});