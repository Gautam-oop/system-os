/* ==========================================================================
   MISSIONOS - NATIVE SAAS ANIMATIONS MODULE (ZERO EXTERNAL DEPENDENCIES)
   ========================================================================== */

// Easing presets (Linear / Apple spring curves)
const SPRING_CUBIC = 'cubic-bezier(0.16, 1, 0.3, 1)';
const FAST_CUBIC = 'cubic-bezier(0.25, 0.1, 0.25, 1)';

/**
 * Animate Staggered Cards Entrance
 * @param {Array<HTMLElement> | NodeList} elements 
 * @param {number} staggerDelayMs 
 */
export function animateStaggeredEntrance(elements, staggerDelayMs = 40) {
  if (!elements || elements.length === 0) return;
  const arr = Array.from(elements);

  arr.forEach((el, idx) => {
    if (!el || !el.animate) return;
    el.animate(
      [
        { opacity: 0, transform: 'translateY(16px) scale(0.98)' },
        { opacity: 1, transform: 'translateY(0px) scale(1)' }
      ],
      {
        duration: 320,
        delay: idx * staggerDelayMs,
        easing: SPRING_CUBIC,
        fill: 'forwards'
      }
    );
  });
}

/**
 * Animate Smooth Page Transition
 * @param {HTMLElement} incomingSection 
 */
export function animatePageTransition(incomingSection) {
  if (!incomingSection || !incomingSection.animate) return;
  incomingSection.animate(
    [
      { opacity: 0, transform: 'translateY(10px)' },
      { opacity: 1, transform: 'translateY(0px)' }
    ],
    { duration: 250, easing: SPRING_CUBIC, fill: 'forwards' }
  );
}

/**
 * Animate Animated Counter
 * @param {HTMLElement} element 
 * @param {number} targetValue 
 * @param {string} prefix 
 * @param {string} suffix 
 * @param {number} durationMs 
 */
export function animateCounter(element, targetValue, prefix = '', suffix = '', durationMs = 400) {
  if (!element) return;
  
  const startTime = performance.now();
  const startVal = 0;

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / durationMs, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 4);
    const currentVal = Math.floor(startVal + (targetValue - startVal) * easedProgress);

    element.textContent = `${prefix}${currentVal}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = `${prefix}${targetValue}${suffix}`;
    }
  }

  requestAnimationFrame(step);
}

/**
 * Animate Progress Bar Growth
 * @param {HTMLElement} progressBarFill 
 * @param {number} targetPct 
 */
export function animateProgressBar(progressBarFill, targetPct) {
  if (!progressBarFill) return;
  progressBarFill.style.transition = 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
  progressBarFill.style.width = `${targetPct}%`;
}

/**
 * Animate Modal Spotlight Spring Open
 * @param {HTMLElement} modalContent 
 * @param {HTMLElement} modalOverlay 
 */
export function animateModalOpen(modalContent, modalOverlay) {
  if (modalOverlay && modalOverlay.animate) {
    modalOverlay.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: 200, easing: FAST_CUBIC, fill: 'forwards' }
    );
  }

  if (modalContent && modalContent.animate) {
    modalContent.animate(
      [
        { opacity: 0, transform: 'scale(0.94) translateY(12px)' },
        { opacity: 1, transform: 'scale(1) translateY(0px)' }
      ],
      { duration: 280, easing: SPRING_CUBIC, fill: 'forwards' }
    );
  }
}

/**
 * Animate Modal Spotlight Exit
 * @param {HTMLElement} modalContent 
 * @param {HTMLElement} modalOverlay 
 * @param {Function} onComplete 
 */
export function animateModalClose(modalContent, modalOverlay, onComplete) {
  if (modalOverlay && modalOverlay.animate) {
    modalOverlay.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: 180, easing: FAST_CUBIC, fill: 'forwards' }
    );
  }

  if (modalContent && modalContent.animate) {
    const anim = modalContent.animate(
      [
        { opacity: 1, transform: 'scale(1) translateY(0px)' },
        { opacity: 0, transform: 'scale(0.95) translateY(8px)' }
      ],
      { duration: 180, easing: FAST_CUBIC, fill: 'forwards' }
    );
    anim.onfinish = () => { if (onComplete) onComplete(); };
  } else if (onComplete) {
    onComplete();
  }
}

/**
 * Animate Status Badge Pulse
 * @param {HTMLElement} badgeEl 
 */
export function animateStatusPulse(badgeEl) {
  if (!badgeEl || !badgeEl.animate) return;
  badgeEl.animate(
    [
      { transform: 'scale(1)' },
      { transform: 'scale(1.15)' },
      { transform: 'scale(1)' }
    ],
    { duration: 300, easing: SPRING_CUBIC }
  );
}

/**
 * Animate Notification Toast Entrance & Exit
 * @param {HTMLElement} toastEl 
 */
export function animateToast(toastEl) {
  if (!toastEl || !toastEl.animate) return;
  toastEl.animate(
    [
      { opacity: 0, transform: 'translateY(20px) scale(0.95)' },
      { opacity: 1, transform: 'translateY(0px) scale(1)' }
    ],
    { duration: 250, easing: SPRING_CUBIC, fill: 'forwards' }
  );
}
