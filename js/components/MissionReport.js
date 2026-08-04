/* ==========================================================================
   MISSIONOS - MISSION REPORT PAGE COMPONENT
   ========================================================================== */

import { store } from '../store.js';
import { reportService } from '../services/ReportService.js';
import { animateStaggeredEntrance, animateCounter, animateProgressBar } from '../animations.js';

export function renderMissionReport(containerEl) {
  const state = store.getState();
  const report = reportService.generateReport(state);

  containerEl.innerHTML = `
    <div class="report-page">

      <!-- Report Header -->
      <div class="glass-panel report-header-card">
        <div class="report-header-top">
          <div>
            <div class="report-badge-row">
              <span class="badge badge-emerald">✓ MISSION COMPLETED</span>
              <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-dim);">${report.missionId}</span>
            </div>
            <h1 class="report-title">${report.missionName}</h1>
            <p class="report-subtitle">${report.summary}</p>
          </div>
          <div class="report-header-actions">
            <button class="btn btn-primary" id="download-report-btn">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download Report
            </button>
          </div>
        </div>
        <div class="report-meta-row">
          <div class="report-meta-item">
            <span class="report-meta-label">Completion Date</span>
            <span class="report-meta-value">${report.completionDate}</span>
          </div>
          <div class="report-meta-item">
            <span class="report-meta-label">Time</span>
            <span class="report-meta-value">${report.completionTime}</span>
          </div>
          <div class="report-meta-item">
            <span class="report-meta-label">Duration</span>
            <span class="report-meta-value">${report.duration}</span>
          </div>
          <div class="report-meta-item">
            <span class="report-meta-label">AI Teammates</span>
            <span class="report-meta-value">${report.agentPerformance.length} Engineers</span>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="report-stats-grid">
        <div class="glass-panel report-stat-card">
          <div class="report-stat-value" id="rstat-total">${report.stats.totalTasks}</div>
          <div class="report-stat-label">Total Tasks</div>
        </div>
        <div class="glass-panel report-stat-card">
          <div class="report-stat-value" style="color: #10b981;" id="rstat-completed">${report.stats.completedTasks}</div>
          <div class="report-stat-label">Completed</div>
        </div>
        <div class="glass-panel report-stat-card">
          <div class="report-stat-value" style="color: #0891b2;" id="rstat-efficiency">${report.stats.avgEfficiency}%</div>
          <div class="report-stat-label">AI Efficiency</div>
        </div>
        <div class="glass-panel report-stat-card">
          <div class="report-stat-value" style="color: #8b5cf6;" id="rstat-success">${report.stats.successRate}%</div>
          <div class="report-stat-label">Success Rate</div>
        </div>
        <div class="glass-panel report-stat-card">
          <div class="report-stat-value" id="rstat-days">${report.durationDays}</div>
          <div class="report-stat-label">Duration (Days)</div>
        </div>
        <div class="glass-panel report-stat-card">
          <div class="report-stat-value" style="color: #10b981;">100%</div>
          <div class="report-stat-label">Overall Progress</div>
          <div class="progress-bar-bg" style="margin-top: 0.5rem;">
            <div class="progress-bar-fill rstat-progress-fill" style="width: 0%;"></div>
          </div>
        </div>
      </div>

      <!-- Two-column: Timeline + Deliverables -->
      <div class="report-two-col">

        <!-- Project Timeline -->
        <div class="glass-panel report-section">
          <h2 class="report-section-title">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            Project Timeline
          </h2>
          <div class="report-timeline">
            ${report.timeline.map((t, i) => `
              <div class="report-timeline-item">
                <div class="report-timeline-dot"></div>
                ${i < report.timeline.length - 1 ? '<div class="report-timeline-line"></div>' : ''}
                <div class="report-timeline-content">
                  <span class="report-timeline-icon">${t.icon}</span>
                  <span class="report-timeline-phase">${t.phase}</span>
                  <span class="report-timeline-time">${t.time}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Final Deliverables -->
        <div class="glass-panel report-section">
          <h2 class="report-section-title">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            Final Deliverables
          </h2>
          <ul class="report-deliverables">
            ${report.deliverables.map(d => `
              <li class="report-deliverable-item">
                <svg width="16" height="16" fill="none" stroke="#10b981" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>${d}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>

      <!-- AI Workforce Performance Table -->
      <div class="glass-panel report-section">
        <h2 class="report-section-title">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          AI Workforce Performance
        </h2>
        <div class="report-agent-table-wrap">
          <table class="report-agent-table">
            <thead>
              <tr>
                <th>Teammate</th>
                <th>Role</th>
                <th>Tasks Completed</th>
                <th>Avg Time</th>
                <th>Success Rate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${report.agentPerformance.map(a => `
                <tr>
                  <td>
                    <div style="display:flex;align-items:center;gap:0.6rem;">
                      <div class="report-agent-avatar" style="background:${a.avatarBg};color:${a.avatarColor};">
                        ${a.name.substring(0, 2).toUpperCase()}
                      </div>
                      <strong>${a.name}</strong>
                    </div>
                  </td>
                  <td>${a.role}</td>
                  <td>${a.tasksCompleted}</td>
                  <td>${a.avgCompletionTime}</td>
                  <td>${a.successRate}</td>
                  <td><span class="badge badge-emerald">Completed</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Footer -->
      <div class="report-footer">
        <p>Generated by <strong>missionOS</strong> AI Workforce Operating System &bull; ${report.completionDate}</p>
      </div>
    </div>
  `;

  // Animate progress fill
  setTimeout(() => {
    const fill = containerEl.querySelector('.rstat-progress-fill');
    if (fill) animateProgressBar(fill, 100);
  }, 100);

  // Animate cards entrance
  setTimeout(() => {
    const cards = containerEl.querySelectorAll('.glass-panel, .report-timeline-item, .report-deliverable-item');
    animateStaggeredEntrance(cards, 40);
  }, 20);

  // Download button
  const dlBtn = containerEl.querySelector('#download-report-btn');
  if (dlBtn) {
    dlBtn.addEventListener('click', () => {
      reportService.downloadReport(state);
      store.notify('toast', { type: 'success', text: 'Mission Report downloaded!' });
    });
  }
}
