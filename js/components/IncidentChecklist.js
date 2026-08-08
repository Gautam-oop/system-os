/* ==========================================================================
   MISSIONOS — INCIDENT ACTION CHECKLIST UI COMPONENT
   Interactive operational checklist with AI recommendations and timeline.
   ========================================================================== */

import { store } from '../store.js';
import { incidentChecklistService } from '../services/IncidentChecklistService.js';
import { animateProgressBar, animateStaggeredEntrance } from '../animations.js';

// Default incident ID for the current mission context
const ACTIVE_INCIDENT_ID = 'incident_active_001';

export function renderIncidentChecklist(containerEl, activeIncidentId = 'incident_active_001') {
  const incidents = incidentChecklistService.getIncidents();
  const currentIncident = incidentChecklistService.getIncident(activeIncidentId);
  const checklist = incidentChecklistService.getChecklist(activeIncidentId);
  const progress = incidentChecklistService.getProgress(activeIncidentId);
  const recommendation = incidentChecklistService.getRecommendedNextAction(activeIncidentId);
  const timelineEvents = incidentChecklistService.getTimelineEvents(activeIncidentId);

  containerEl.innerHTML = `
    <!-- Section Header -->
    <div class="section-header">
      <div class="section-title-group">
        <div class="section-icon" style="background: var(--rose-bg); color: var(--rose);">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M9 11l3 3L22 4"></path>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
          </svg>
        </div>
        <div>
          <h2 class="section-title">${currentIncident.code}: ${currentIncident.name}</h2>
          <p class="section-subtitle">AI-assisted operational response workflow for active incidents</p>
        </div>
      </div>

      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <select id="incident-selector" class="badge" style="background: #f8fafc; border: 1px solid var(--border-subtle); color: var(--text-main); font-family: var(--font-sans); padding: 0.35rem 0.6rem; border-radius: 6px; cursor: pointer;">
          ${incidents.map(inc => `
            <option value="${inc.id}" ${inc.id === activeIncidentId ? 'selected' : ''}>
              ${inc.code} (${inc.progress.completed}/${inc.progress.total})
            </option>
          `).join('')}
        </select>
        <span class="badge ${progress.percentage === 100 ? 'badge-emerald' : 'badge-rose'}">
          ${progress.percentage === 100 ? '✓ ALL COMPLETE' : `${progress.completed} / ${progress.total} STEPS (${progress.percentage}%)`}
        </span>
      </div>
    </div>

    <!-- Main Checklist Layout -->
    <div class="checklist-layout">

      <!-- Left Column: AI Recommendation + Checklist -->
      <div class="checklist-main-col">

        <!-- AI Recommended Next Action Card -->
        <div class="glass-panel checklist-ai-card no-hover" id="checklist-ai-card">
          <div class="checklist-ai-header">
            <div class="checklist-ai-icon">
              <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <div>
              <div class="checklist-ai-label">AI RECOMMENDED NEXT ACTION</div>
              <div class="checklist-ai-title">${recommendation.allComplete ? 'Incident Response Complete' : recommendation.title}</div>
            </div>
            ${recommendation.allComplete
              ? '<span class="badge badge-emerald" style="margin-left: auto;">RESOLVED</span>'
              : '<span class="badge badge-amber" style="margin-left: auto;">PENDING</span>'
            }
          </div>
          <div class="checklist-ai-body">
            <p class="checklist-ai-recommendation">"${recommendation.recommendation}"</p>
          </div>
        </div>

        <!-- Action Checklist -->
        <div class="glass-panel no-hover" style="padding: 1.5rem;">
          <div class="checklist-section-title">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"></path>
              <path d="M14 3v5h5M16 13H8M16 17H8M10 9H8"></path>
            </svg>
            Response Actions (${progress.completed} / ${progress.total} Completed)
          </div>

          <div class="checklist-items" id="checklist-items">
            ${checklist.map((action, idx) => `
              <div class="checklist-item ${action.completed ? 'completed' : ''} ${recommendation.actionId === action.id ? 'recommended' : ''}" 
                   data-action-id="${action.id}" 
                   data-index="${idx}"
                   role="checkbox"
                   aria-checked="${action.completed}"
                   aria-label="${action.title} - ${action.completed ? 'Completed' : 'Pending'}"
                   tabindex="0">
                <div class="checklist-item-checkbox">
                  ${action.completed
                    ? `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>`
                    : `<span class="checklist-empty-check"></span>`
                  }
                </div>
                <div class="checklist-item-content">
                  <span class="checklist-item-title">${action.title}</span>
                  ${action.completed && action.completedAt
                    ? `<span class="checklist-item-time">${formatTimestamp(action.completedAt)}</span>`
                    : ''
                  }
                </div>
                <div class="checklist-item-status">
                  ${action.completed
                    ? '<span class="badge badge-emerald" style="font-size: 0.6rem; padding: 0.15rem 0.4rem;">DONE</span>'
                    : recommendation.actionId === action.id
                      ? '<span class="badge badge-amber" style="font-size: 0.6rem; padding: 0.15rem 0.4rem;">NEXT</span>'
                      : '<span class="badge badge-secondary" style="font-size: 0.6rem; padding: 0.15rem 0.4rem;">PENDING</span>'
                  }
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Right Column: Progress + Timeline -->
      <div class="checklist-side-col">

        <!-- Progress Summary Card -->
        <div class="glass-panel no-hover" style="padding: 1.5rem;">
          <div class="checklist-section-title">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
            Progress Summary
          </div>

          <!-- Percentage Display -->
          <div class="checklist-progress-pct" id="checklist-pct">
            ${progress.percentage}<span style="font-size: 1.5rem; font-weight: 600;">%</span>
          </div>
          <div class="checklist-progress-label">Incident Response</div>

          <!-- Progress Bar -->
          <div class="progress-bar-bg" style="height: 10px; margin: 1rem 0;">
            <div class="progress-bar-fill checklist-progress-fill" style="width: 0%; background: ${progress.percentage === 100 ? 'linear-gradient(90deg, #10b981, #059669)' : 'linear-gradient(90deg, #6366f1, #8b5cf6)'};"></div>
          </div>

          <!-- Stats Grid -->
          <div class="checklist-stats-grid">
            <div class="checklist-stat">
              <div class="checklist-stat-value">${progress.total}</div>
              <div class="checklist-stat-label">Total</div>
            </div>
            <div class="checklist-stat">
              <div class="checklist-stat-value" style="color: var(--emerald);">${progress.completed}</div>
              <div class="checklist-stat-label">Completed</div>
            </div>
            <div class="checklist-stat">
              <div class="checklist-stat-value" style="color: var(--amber);">${progress.remaining}</div>
              <div class="checklist-stat-label">Remaining</div>
            </div>
          </div>

          <!-- Estimated Completion -->
          <div class="checklist-estimated">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>Est. Completion: ${progress.percentage === 100 ? 'Complete' : estimateCompletion(progress)}</span>
          </div>
        </div>

        <!-- Incident Timeline -->
        <div class="glass-panel no-hover" style="padding: 1.5rem;">
          <div class="checklist-section-title">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            Response Timeline
          </div>

          <div class="checklist-timeline" id="checklist-timeline">
            ${timelineEvents.length === 0
              ? `<div class="checklist-timeline-empty">
                  <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" style="opacity: 0.4;">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  No actions completed yet. Complete checklist items to see timeline events.
                </div>`
              : timelineEvents
                  .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                  .map(evt => `
                    <div class="checklist-timeline-event">
                      <div class="checklist-timeline-dot"></div>
                      <div class="checklist-timeline-content">
                        <span class="checklist-timeline-time">${evt.displayTime}</span>
                        <span class="checklist-timeline-text">
                          <svg width="12" height="12" fill="none" stroke="#10b981" stroke-width="2.5" viewBox="0 0 24 24" style="flex-shrink: 0;">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          ${evt.actionTitle} Completed
                        </span>
                      </div>
                    </div>
                  `).join('')
            }
          </div>
        </div>
      </div>
    </div>
  `;

  // Animate progress bar
  setTimeout(() => {
    const fill = containerEl.querySelector('.checklist-progress-fill');
    if (fill) animateProgressBar(fill, progress.percentage);
  }, 50);

  // Animate checklist items staggered entrance
  setTimeout(() => {
    const items = containerEl.querySelectorAll('.checklist-item');
    if (items.length > 0) animateStaggeredEntrance(items, 30);
  }, 20);

  // Bind incident selector dropdown
  const selector = containerEl.querySelector('#incident-selector');
  if (selector) {
    selector.addEventListener('change', (e) => {
      renderIncidentChecklist(containerEl, e.target.value);
    });
  }

  // Bind click events to checklist items
  bindChecklistEvents(containerEl, activeIncidentId);
}

/**
 * Bind interactive events to checklist items.
 */
function bindChecklistEvents(containerEl, incidentId) {
  const items = containerEl.querySelectorAll('.checklist-item');

  items.forEach(item => {
    const handler = (e) => {
      e.preventDefault();
      const actionId = item.getAttribute('data-action-id');
      const result = incidentChecklistService.toggleAction(incidentId, actionId);

      if (result) {
        // Add activity log for completed actions
        if (result.toggled.completed) {
          store.addActivityLog({
            agentName: 'Incident Response',
            message: `✓ Checklist action "${result.toggled.title}" completed for ${incidentId}.`,
            severity: 'SUCCESS',
            category: 'SYSTEM',
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
          });
        }

        // Notify store for any subscribers
        store.notify('checklistUpdated', {
          incidentId,
          action: result.toggled,
          progress: incidentChecklistService.getProgress(incidentId)
        });

        // Re-render the checklist for this incident
        renderIncidentChecklist(containerEl, incidentId);

        // Show toast
        store.notify('toast', {
          type: result.toggled.completed ? 'success' : 'info',
          text: result.toggled.completed
            ? `✓ ${result.toggled.title} marked as complete`
            : `↩ ${result.toggled.title} marked as incomplete`
        });
      }
    };

    // Mouse click
    item.addEventListener('click', handler);

    // Keyboard: Enter or Space
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handler(e);
      }
    });
  });
}

/**
 * Format ISO timestamp to a readable time string.
 */
function formatTimestamp(isoString) {
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  } catch {
    return '';
  }
}

/**
 * Estimate completion time based on current progress.
 */
function estimateCompletion(progress) {
  if (progress.remaining === 0) return 'Complete';
  const avgMinutesPerStep = 8;
  const estMinutes = progress.remaining * avgMinutesPerStep;
  if (estMinutes < 60) return `~${estMinutes} min remaining`;
  const hours = Math.floor(estMinutes / 60);
  const mins = estMinutes % 60;
  return `~${hours}h ${mins}m remaining`;
}
