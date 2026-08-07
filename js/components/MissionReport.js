/* ==========================================================================
   MISSIONOS - MISSION REPORT PAGE COMPONENT (Premium Design)
   A beautifully polished post-mission summary with animated stats,
   timeline visualization, performance table, and downloadable export.
   ========================================================================== */

import { store } from '../store.js';
import { reportService } from '../services/ReportService.js';
import { animateStaggeredEntrance, animateCounter, animateProgressBar } from '../animations.js';

export function renderMissionReport(containerEl) {
  const state = store.getState();
  const report = reportService.generateReport(state);

  containerEl.innerHTML = `
    <div class="report-page">

      <!-- ═══ Report Header — Hero Card ═══ -->
      <div class="report-header-card">
        <div class="report-header-glow"></div>
        <div class="report-header-inner">
          <div class="report-header-top">
            <div>
              <div class="report-badge-row">
                <span class="report-status-badge">
                  <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  MISSION COMPLETED
                </span>
                <span class="report-id-chip">${report.missionId}</span>
              </div>
              <h1 class="report-title">${report.missionName}</h1>
              <p class="report-subtitle">${report.summary}</p>
            </div>
            <div class="report-header-actions">
              <button class="report-download-btn" id="download-report-btn">
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
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <div>
                <span class="report-meta-label">Completed</span>
                <span class="report-meta-value">${report.completionDate}</span>
              </div>
            </div>
            <div class="report-meta-divider"></div>
            <div class="report-meta-item">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <div>
                <span class="report-meta-label">Time</span>
                <span class="report-meta-value">${report.completionTime}</span>
              </div>
            </div>
            <div class="report-meta-divider"></div>
            <div class="report-meta-item">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20"></path></svg>
              <div>
                <span class="report-meta-label">Duration</span>
                <span class="report-meta-value">${report.duration}</span>
              </div>
            </div>
            <div class="report-meta-di              <div class="report-meta-item">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
                <div>
                  <span class="report-meta-label">AI Team</span>
                  <span class="report-meta-value">${(report.agentPerformance || []).length} Engineers</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ═══ Stats Grid ═══ -->
        <div class="report-stats-grid">
          <div class="report-stat-card">
            <div class="report-stat-icon" style="background: rgba(99,102,241,0.1); color: #6366f1;">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
            </div>
            <div class="report-stat-value" id="rstat-total">${report.stats ? report.stats.totalTasks : 0}</div>
            <div class="report-stat-label">Total Tasks</div>
          </div>
          <div class="report-stat-card">
            <div class="report-stat-icon" style="background: rgba(16,185,129,0.1); color: #10b981;">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div class="report-stat-value" style="color: #10b981;" id="rstat-completed">${report.stats ? report.stats.completedTasks : 0}</div>
            <div class="report-stat-label">Completed</div>
          </div>
          <div class="report-stat-card">
            <div class="report-stat-icon" style="background: rgba(8,145,178,0.1); color: #0891b2;">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
            </div>
            <div class="report-stat-value" style="color: #0891b2;" id="rstat-efficiency">${report.stats ? report.stats.avgEfficiency : 95}%</div>
            <div class="report-stat-label">AI Efficiency</div>
          </div>
          <div class="report-stat-card">
            <div class="report-stat-icon" style="background: rgba(139,92,246,0.1); color: #8b5cf6;">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
            </div>
            <div class="report-stat-value" style="color: #8b5cf6;" id="rstat-success">${report.stats ? report.stats.successRate : 100}%</div>
            <div class="report-stat-label">Success Rate</div>
          </div>
          <div class="report-stat-card">
            <div class="report-stat-icon" style="background: rgba(245,158,11,0.1); color: #f59e0b;">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line></svg>
            </div>
            <div class="report-stat-value" style="color: #f59e0b;" id="rstat-days">${report.durationDays || 1}</div>
            <div class="report-stat-label">Days</div>
          </div>
          <div class="report-stat-card">
            <div class="report-stat-icon" style="background: rgba(16,185,129,0.1); color: #10b981;">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <div class="report-stat-value" style="color: #10b981;">100%</div>
            <div class="report-stat-label">Progress</div>
            <div class="progress-bar-bg" style="margin-top: 0.5rem; height: 4px;">
              <div class="progress-bar-fill rstat-progress-fill" style="width: 0%;"></div>
            </div>
          </div>
        </div>

        <!-- ═══ Two Column: Timeline + Deliverables ═══ -->
        <div class="report-two-col">

          <!-- Project Timeline -->
          <div class="report-section">
            <h2 class="report-section-title">
              <div class="report-section-icon">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              Project Timeline
            </h2>
            <div class="report-timeline">
              ${(report.timeline || []).map((t, i) => `
                <div class="report-timeline-item ${i === (report.timeline || []).length - 1 ? 'last' : ''}">
                  <div class="report-timeline-track">
                    <div class="report-timeline-dot"></div>
                    ${i < (report.timeline || []).length - 1 ? '<div class="report-timeline-line"></div>' : ''}
                  </div>
                  <div class="report-timeline-content">
                    <span class="report-timeline-icon">${t.icon || '🚀'}</span>
                    <span class="report-timeline-phase">${t.phase || ''}</span>
                    <span class="report-timeline-time">${t.time || ''}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Final Deliverables -->
          <div class="report-section">
            <h2 class="report-section-title">
              <div class="report-section-icon" style="background: rgba(16,185,129,0.1); color: #10b981;">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              Final Deliverables
            </h2>
            <ul class="report-deliverables">
              ${(report.deliverables || []).map(d => `
                <li class="report-deliverable-item">
                  <div class="report-check-icon">
                    <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span>${d}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>

        <!-- ═══ AI Workforce Performance Table ═══ -->
        <div class="report-section report-section-full">
          <h2 class="report-section-title">
            <div class="report-section-icon" style="background: rgba(139,92,246,0.1); color: #8b5cf6;">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            AI Workforce Performance
          </h2>
          <div class="report-agent-table-wrap">
            <table class="report-agent-table">
              <thead>
                <tr>
                  <th>Teammate</th>
                  <th>Role</th>
                  <th>Tasks</th>
                  <th>Avg Time</th>
                  <th>Success</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${(report.agentPerformance || []).map(a => `
                  <tr>
                    <td>
                      <div class="report-agent-cell">
                        <div class="report-agent-avatar" style="background:${a.avatarBg || 'rgba(99,102,241,0.1)'};color:${a.avatarColor || '#6366f1'};">
                          ${(a.name || 'AI').substring(0, 2).toUpperCase()}
                        </div>
                        <strong>${a.name || 'Agent'}</strong>
                      </div>
                    </td>
                    <td>${a.role || 'Engineer'}</td>
                    <td><strong>${a.tasksCompleted || 0}</strong></td>
                    <td>${a.avgCompletionTime || '2 mins'}</td>
                    <td><strong>${a.successRate || '100%'}</strong></td>
                    <td><span class="badge badge-emerald">Completed</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- ═══ Detailed Task Execution Log ═══ -->
        <div class="report-section report-section-full">
          <h2 class="report-section-title">
            <div class="report-section-icon" style="background: rgba(16,185,129,0.1); color: #10b981;">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
            Detailed Task Execution Log
          </h2>
          
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${(report.taskDetails || []).map(t => `
              <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 1.25rem;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                  <div>
                    <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--text); margin: 0 0 0.25rem 0; line-height: 1.3;">
                      ${t.title} 
                      <span style="font-size: 0.75rem; color: var(--text-tertiary); font-weight: 600; font-family: var(--font-mono); margin-left: 0.5rem; letter-spacing: 0.05em;">${t.id}</span>
                    </h3>
                    <div style="font-size: 0.8rem; color: var(--text-secondary); display: flex; align-items: center; gap: 0.75rem;">
                      <span><strong style="color: var(--text);">Agent:</strong> ${t.agent}</span>
                      <span><strong style="color: var(--text);">Priority:</strong> ${t.priority.toUpperCase()}</span>
                    </div>
                  </div>
                  <span class="badge ${t.status === 'completed' ? 'badge-emerald' : t.status === 'ai_executing' ? 'badge-purple' : 'badge-amber'}">${t.status.toUpperCase()}</span>
                </div>
                
                ${t.subtasks && t.subtasks.length > 0 ? `
                  <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px dashed var(--border-subtle);">
                    <div style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--text-tertiary); font-weight: 700; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.05em;">Subtask Trace</div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 0.5rem;">
                      ${t.subtasks.map(s => `
                        <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: ${s.done ? 'var(--text-secondary)' : 'var(--text-tertiary)'}; background: rgba(0,0,0,0.1); padding: 0.4rem 0.6rem; border-radius: 6px; border: 1px solid rgba(255,255,255,0.03);">
                          <span style="color: ${s.done ? '#10b981' : '#64748b'}; font-weight: bold; font-size: 0.9rem;">${s.done ? '✓' : '○'}</span>
                          ${s.title}
                        </div>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>

      <!-- ═══ Footer ═══ -->
      <div class="report-footer">
        <div class="report-footer-logo">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
          missionOS
        </div>
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
    const cards = containerEl.querySelectorAll('.report-stat-card, .report-section, .report-timeline-item, .report-deliverable-item');
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
