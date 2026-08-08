/* ==========================================================================
   MISSIONOS - MISSION COMPLETE OVERLAY (Fullscreen Celebration)
   ========================================================================== */

import { store } from '../store.js?v=29';

export function showMissionCompleteOverlay() {
  // Don't show twice
  if (document.getElementById('mission-complete-overlay')) return;

  const mission = store.getState().mission || {};

  const overlay = document.createElement('div');
  overlay.id = 'mission-complete-overlay';
  overlay.className = 'mission-complete-overlay';
  overlay.innerHTML = `
    <div class="mission-complete-backdrop"></div>
    <div class="mission-complete-card" style="max-width: 700px; width: 90%; padding: 2rem;">
      <div style="display: flex; gap: 2rem;">
          <div style="flex: 1;">
              <div class="mission-complete-icon" style="margin: 0 0 1rem 0;">
                <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="30" stroke="#10b981" stroke-width="3" fill="rgba(16,185,129,0.08)"/>
                  <polyline points="20,34 28,42 44,24" stroke="#10b981" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                </svg>
              </div>
              <h1 class="mission-complete-title" style="font-size: 1.5rem; text-align: left;">Mission Completed</h1>
              <p class="mission-complete-name" style="text-align: left; margin-bottom: 1rem;">${mission.name || 'Project Alpha (SaaS OS)'}</p>
              
              <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.8rem; font-family: var(--font-mono); color: var(--text-secondary);">
                  <div><strong style="color: var(--text);">Validation Status:</strong> ${store.state.missionIntelligence?.validationStatus || 'Passed'}</div>
                  <div><strong style="color: var(--text);">Build Status:</strong> ${store.state.missionIntelligence?.buildProgress === 100 ? '<span style="color: #10b981;">Successful</span>' : '<span style="color: #ef4444;">Failed</span>'}</div>
                  <div><strong style="color: var(--text);">Files Generated:</strong> ${store.state.projectExplorer?.files?.length || 0} files</div>
              </div>
          </div>
          
          <div style="flex: 1.5; background: rgba(0,0,0,0.02); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--border-subtle);">
              <h3 style="margin-top: 0; margin-bottom: 1rem; font-size: 1rem; color: var(--text);">Project Summary</h3>
              
              <div style="margin-bottom: 0.75rem;">
                  <div style="font-size: 0.75rem; color: var(--text-tertiary); font-weight: 600; margin-bottom: 0.25rem;">ARCHITECTURE</div>
                  <div style="font-size: 0.85rem; color: var(--text-secondary);">${store.state.missionReport?.architecture || 'Microservices Monorepo'}</div>
              </div>
              
              <div style="margin-bottom: 0.75rem;">
                  <div style="font-size: 0.75rem; color: var(--text-tertiary); font-weight: 600; margin-bottom: 0.25rem;">TECH STACK</div>
                  <div style="display: flex; flex-wrap: wrap; gap: 0.25rem;">
                      ${(store.state.missionReport?.techStack || ['React', 'FastAPI', 'Python']).map(t => `<span style="padding: 2px 6px; background: rgba(99,102,241,0.1); color: var(--accent); border-radius: 4px; font-size: 0.75rem;">${t}</span>`).join('')}
                  </div>
              </div>
              
              <div style="margin-bottom: 1rem;">
                  <div style="font-size: 0.75rem; color: var(--text-tertiary); font-weight: 600; margin-bottom: 0.25rem;">REMAINING RISKS</div>
                  <ul style="margin: 0; padding-left: 1rem; font-size: 0.85rem; color: var(--text-secondary);">
                      ${(store.state.missionReport?.risks || ['Needs human deployment verification']).map(r => `<li>${r}</li>`).join('')}
                  </ul>
              </div>
              
              <a href="${store.state.missionReport?.downloadUrl || '#'}" class="btn btn-primary" style="width: 100%; justify-content: center; text-decoration: none;">
                  <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Download Project Workspace
              </a>
          </div>
      </div>
      
      <div class="mission-complete-actions" style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-subtle);">
        <button class="btn btn-secondary mission-complete-btn" id="mc-dismiss-btn" style="width: 100%;">
          Close & Continue
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
  const viewReportBtn = overlay.querySelector('#mc-view-report-btn');
  if (viewReportBtn) {
      viewReportBtn.addEventListener('click', () => {
        dismissOverlay(overlay);
        store.setActiveTab('report');
      });
  }

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
