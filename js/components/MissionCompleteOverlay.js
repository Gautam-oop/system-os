/* ==========================================================================
   MISSIONOS - MISSION COMPLETE OVERLAY (Fullscreen Celebration)
   ========================================================================== */

import { store } from '../store.js';

export function showMissionCompleteOverlay() {
  // Don't show twice
  if (document.getElementById('mission-complete-overlay')) return;

  const mission = store.getState().mission || {};

  const overlay = document.createElement('div');
  overlay.id = 'mission-complete-overlay';
  overlay.className = 'mission-complete-overlay';
  overlay.innerHTML = `
    <div class="mission-complete-backdrop"></div>
    <div class="mission-complete-card">
      <div class="mission-complete-icon">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" stroke="#10b981" stroke-width="3" fill="rgba(16,185,129,0.08)"/>
          <polyline points="20,34 28,42 44,24" stroke="#10b981" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
      </div>
      <h1 class="mission-complete-title">Mission Completed</h1>
      <p class="mission-complete-name">${mission.name || 'SaaS OS'}</p>
      <p class="mission-complete-desc">All AI teammates have completed their assignments.<br>Every task has been verified and delivered.</p>
      <div class="mission-complete-actions">
        <button class="btn btn-primary mission-complete-btn" id="mc-view-report-btn">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
          View Mission Report
        </button>
        <button class="btn btn-secondary mission-complete-btn" id="mc-dismiss-btn">
          Continue to Dashboard
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Animate entrance
  requestAnimationFrame(() => {
    const backdrop = overlay.querySelector('.mission-complete-backdrop');
    const card = overlay.querySelector('.mission-complete-card');

    if (backdrop) {
      backdrop.animate(
        [{ opacity: 0 }, { opacity: 1 }],
        { duration: 300, easing: 'ease-out', fill: 'forwards' }
      );
    }
    if (card) {
      card.animate(
        [
          { opacity: 0, transform: 'scale(0.9) translateY(30px)' },
          { opacity: 1, transform: 'scale(1) translateY(0px)' }
        ],
        { duration: 400, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
      );
    }
  });

  // Wire buttons
  overlay.querySelector('#mc-view-report-btn').addEventListener('click', () => {
    dismissOverlay(overlay);
    store.setActiveTab('report');
  });

  overlay.querySelector('#mc-dismiss-btn').addEventListener('click', () => {
    dismissOverlay(overlay);
  });
}

function dismissOverlay(overlay) {
  const backdrop = overlay.querySelector('.mission-complete-backdrop');
  const card = overlay.querySelector('.mission-complete-card');

  if (card) {
    card.animate(
      [
        { opacity: 1, transform: 'scale(1) translateY(0px)' },
        { opacity: 0, transform: 'scale(0.95) translateY(15px)' }
      ],
      { duration: 200, easing: 'ease-in', fill: 'forwards' }
    );
  }
  if (backdrop) {
    backdrop.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: 250, easing: 'ease-in', fill: 'forwards' }
    );
  }

  setTimeout(() => overlay.remove(), 260);
}
