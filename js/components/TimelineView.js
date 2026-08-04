/* ==========================================================================
   TIMELINE (ENGINEERING ROADMAP GANTT) COMPONENT - ANIMATED
   ========================================================================== */

import { store } from '../store.js';
import { animateProgressBar } from '../animations.js';

export function renderTimelineView(containerEl) {
  const state = store.getState();
  const phases = state.timelinePhases || [];
  const isLoading = store.getLoading().timeline;
  const error = store.errors.timeline;

  if (error) {
    containerEl.innerHTML = `
      <div class="error-banner">
        <div class="error-banner-content">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          <div><strong>Failed to load Engineering Roadmap</strong><div>${error}</div></div>
        </div>
        <button class="btn btn-danger btn-sm" id="retry-timeline-btn">Retry</button>
      </div>
    `;
    const btn = containerEl.querySelector('#retry-timeline-btn');
    if (btn) btn.addEventListener('click', () => store.loadAllApiData());
    return;
  }

  if (isLoading && phases.length === 0) {
    containerEl.innerHTML = `
      <div class="glass-panel skeleton-card skeleton" style="height: 300px;"></div>
    `;
    return;
  }

  containerEl.innerHTML = `
    <div class="section-header">
      <div class="section-title-group">
        <div class="section-icon">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <div>
          <h2 class="section-title">Engineering Product Roadmap</h2>
          <p class="section-subtitle">Milestone progression and sprint release timeline</p>
        </div>
      </div>

      <span class="badge badge-purple">${phases.length} EPICS TOTAL</span>
    </div>

    <!-- Timeline / Gantt Board -->
    <div class="glass-panel timeline-container">
      <div class="gantt-header-row">
        <div>RELEASE EPIC</div>
        <div style="text-align: center;">AUG 01 - AUG 04</div>
        <div style="text-align: center;">AUG 05 - AUG 08</div>
        <div style="text-align: center;">AUG 09 - AUG 12</div>
        <div style="text-align: center;">AUG 13 - AUG 15</div>
      </div>

      <div class="gantt-phases-list">
        ${phases.map(phase => `
          <div class="gantt-phase-row">
            <div class="gantt-phase-info">
              <div class="gantt-phase-title">${phase.name}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono); margin-top: 0.2rem;">
                LEAD: <strong style="color: #0891b2;">${phase.leadAgent || phase.leadAgentName || 'Agent'}</strong>
              </div>
            </div>

            <div class="gantt-bar-wrapper">
              <div class="gantt-bar-fill" style="left: ${phase.barLeftPct || 0}%; width: ${phase.barWidthPct || 25}%; background: ${getPhaseGradient(phase.status)};">
                <span>${(phase.status || 'active').toUpperCase().replace('_', ' ')} (${phase.progress || phase.progressPercentage || 0}%)</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Detailed Phase Cards -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.25rem; margin-top: 1.5rem;">
      ${phases.map((phase, idx) => `
        <div class="glass-panel" style="padding: 1.25rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
            <span class="badge ${phase.status === 'completed' ? 'badge-emerald' : phase.status === 'in_progress' ? 'badge-cyan' : 'badge-amber'}">
              ${(phase.status || 'active').toUpperCase().replace('_', ' ')}
            </span>
            <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">
              ${phase.startDay || phase.startDate || 'Aug 01'} - ${phase.endDay || phase.endDate || 'Aug 15'}
            </span>
          </div>

          <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem;">${phase.name}</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">${phase.description}</p>

          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.75rem; font-family: var(--font-mono);">
            <span>COMPLETION</span>
            <span style="color: #0891b2; font-weight: 700;">${phase.progress || phase.progressPercentage || 0}%</span>
          </div>
          <div class="progress-bar-bg" style="margin-top: 0.35rem;">
            <div class="progress-bar-fill phase-fill-${idx}" style="width: 0%;"></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  setTimeout(() => {
    phases.forEach((phase, idx) => {
      const fillEl = containerEl.querySelector(`.phase-fill-${idx}`);
      if (fillEl) animateProgressBar(fillEl, phase.progress || phase.progressPercentage || 0);
    });
  }, 20);
}

function getPhaseGradient(status) {
  if (status === 'completed') return 'linear-gradient(90deg, #10b981, #059669)';
  if (status === 'in_progress') return 'linear-gradient(90deg, #06b6d4, #3b82f6)';
  return 'linear-gradient(90deg, #f59e0b, #d97706)';
}
