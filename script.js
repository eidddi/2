// ============== CONFIGURATION ==============
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwoIPAccBuRcI0MOfNgPENmSK-E4TtKikKc4n_CPIJIX65tQVCw8L87qCeLy3tIDA_F/exec';

// ============== MAIN FUNCTIONS ==============

// 1. Handle Name Submission
async function handleNameSubmit(e) {
  e.preventDefault();
  const nameInput = document.getElementById('nameInput');
  const name = sanitizeInput(nameInput.value);
  
  if (!name) return;

  // Show loading state
  toggleLoading(true);

  try {
    // Save to Google Sheets
    await saveToGoogleSheet(name);
    
    // Update URL with the name
    window.history.pushState({}, '', `?name=${encodeURIComponent(name)}`);
    document.getElementById('friendName').textContent = name;
    
    // Show celebration effects
    createConfetti();
    playCelebrationSound();
    
  } catch (error) {
    console.error("Submission error:", error);
    // Fallback: Still show the name even if Sheets fails
    window.history.pushState({}, '', `?name=${encodeURIComponent(name)}`);
    document.getElementById('friendName').textContent = name;
  } finally {
    toggleLoading(false);
    document.getElementById('nameModal').style.display = 'none';
  }
}

// 2. Save to Google Sheets
async function saveToGoogleSheet(name) {
  const response = await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: name,
      timestamp: new Date().toISOString(),
      source: "EidGreetingPage"
    })
  });
  
  if (!response.ok) throw new Error("Failed to save");
  return await response.text();
}

// ============== UTILITY FUNCTIONS ==============

// Sanitize input
function sanitizeInput(input) {
  return input.replace(/[^a-zA-Z0-9 \-\']/g, '').trim().substring(0, 50);
}

// Loading state toggle
function toggleLoading(show) {
  const btn = document.getElementById('submitBtn');
  const loader = document.getElementById('loadingText');
  btn.disabled = show;
  loader.style.display = show ? 'block' : 'none';
}

// ============== ANIMATIONS ==============

// Confetti effect
function createConfetti() {
  const container = document.getElementById('confettiContainer');
  container.innerHTML = '';
  
  for (let i = 0; i < 75; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.animationDelay = `${Math.random() * 3}s`;
    container.appendChild(confetti);
  }
  
  setTimeout(() => {
    container.innerHTML = '';
  }, 5000);
}

// Celebration sound
function playCelebrationSound() {
  const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-happy-crowd-cheering-2013.mp3');
  audio.volume = 0.3;
  audio.play().catch(e => console.log("Audio blocked:", e));
}

// ============== INITIALIZATION ==============

document.addEventListener('DOMContentLoaded', function() {
  // Check for name in URL
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get('name');
  
  if (name) {
    document.getElementById('friendName').textContent = sanitizeInput(name);
  } else {
    document.getElementById('nameModal').style.display = 'flex';
  }

  // Setup form submission
  document.getElementById('nameForm').addEventListener('submit', handleNameSubmit);

  // Scroll animations
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

  // Scroll indicator
  document.querySelectorAll('.scroll-indicator').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelector('.message-section').scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
});
