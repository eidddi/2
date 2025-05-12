window.addEventListener('load', () => {
  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // Device detection and settings adjustment
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isTablet = /iPad|Android|Tablet/i.test(navigator.userAgent);
  
  // Settings based on device type
  const baseSettings = {
    particleCount: isMobile ? 50 : (isTablet ? 75 : 100),
    spread: isMobile ? 45 : 55,
    startVelocity: isMobile ? 30 : 45,
    decay: 0.9,
    gravity: 1,
    ticks: 200,
    colors: ['#ff0000', '#ff8000', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3']
  };

  // Animation duration and timing
  const duration = 3000; // 3 seconds
  const endTime = Date.now() + duration;
  const interval = isMobile ? 200 : 150; // Slower on mobile

  const confettiInterval = setInterval(() => {
    if (Date.now() > endTime) {
      return clearInterval(confettiInterval);
    }

    // Randomize origin position
    const origin = {
      x: Math.random(),
      y: isMobile ? Math.random() * 0.4 : Math.random() * 0.6
    };

    // Main confetti burst
    confetti({
      ...baseSettings,
      angle: 90,
      origin
    });

    // Occasional special shapes (less frequent on mobile)
    if (Math.random() > (isMobile ? 0.9 : 0.85)) {
      confetti({
        ...baseSettings,
        particleCount: Math.floor(baseSettings.particleCount * 0.3),
        spread: 100,
        shapes: ['circle', 'star'],
        scalar: 1.5,
        origin: {
          x: origin.x + (Math.random() * 0.2 - 0.1),
          y: origin.y
        }
      });
    }

    // Side bursts (only on larger screens)
    if (!isMobile && Math.random() > 0.7) {
      confetti({
        ...baseSettings,
        angle: 45 + Math.random() * 90,
        particleCount: Math.floor(baseSettings.particleCount * 0.6),
        origin: { y: 0.8 }
      });
    }
  }, interval);

  // Handle orientation changes
  window.addEventListener('orientationchange', () => {
    clearInterval(confettiInterval);
  });
});