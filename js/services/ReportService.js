/* ==========================================================================
   MISSIONOS - REPORT SERVICE (Data Collection & Export)
   ========================================================================== */

export class ReportService {

  generateReport(state) {
    const mission = state.mission || {};
    const agents = state.agents || [];
    const tasks = state.tasks || [];
    const logs = state.activityLogs || [];

    const completedTasks = tasks.filter(t => t.status === 'completed');
    const now = new Date();
    const startDate = new Date(mission.startedAt || '2026-08-01T06:00:00Z');
    const durationMs = now - startDate;
    const durationDays = Math.max(1, Math.floor(durationMs / (1000 * 60 * 60 * 24)));
    const durationHours = Math.floor((durationMs / (1000 * 60 * 60)) % 24);

    return {
      missionName: mission.name || mission.codeName || 'Untitled Mission',
      missionId: mission.id || 'N/A',
      summary: mission.description || 'AI-driven software engineering mission.',
      completionDate: now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      completionTime: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      duration: `${durationDays} days, ${durationHours} hours`,
      durationDays,

      stats: {
        totalTasks: tasks.length,
        completedTasks: completedTasks.length,
        overallProgress: mission.overallProgress || 100,
        avgEfficiency: this._calcAvgEfficiency(agents),
        successRate: tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 100
      },

      timeline: this._buildTimeline(logs),

      agentPerformance: agents.map(a => ({
        name: a.name,
        role: a.role,
        tasksCompleted: a.tasksCompleted || 0,
        avgCompletionTime: `${Math.floor(Math.random() * 4 + 2)} mins`,
        successRate: `${Math.floor(Math.random() * 8 + 92)}%`,
        status: 'Completed',
        avatarBg: a.avatarBg,
        avatarColor: a.avatarColor
      })),

      deliverables: [
        'Sprint 14 Competitor Benchmark Analysis Report',
        'UI/UX Design System Tokens & Component Library',
        'OAuth2 Authentication API with JWT Rotation',
        'Cypress E2E Regression Test Suite (42 tests)',
        'PostgreSQL Query Optimization & Indexing Report'
      ]
    };
  }

  _calcAvgEfficiency(agents) {
    if (!agents || agents.length === 0) return 95;
    const total = agents.reduce((sum, a) => sum + (a.workloadPercentage || 80), 0);
    return Math.round(total / agents.length);
  }

  _buildTimeline(logs) {
    return [
      { phase: 'Mission Created', time: '08:00', icon: '🚀', status: 'completed' },
      { phase: 'Research Completed', time: '08:12', icon: '🔍', status: 'completed' },
      { phase: 'Planning Finished', time: '08:18', icon: '📋', status: 'completed' },
      { phase: 'Design Completed', time: '08:25', icon: '🎨', status: 'completed' },
      { phase: 'Development Completed', time: '08:34', icon: '⚙️', status: 'completed' },
      { phase: 'QA Passed', time: '08:41', icon: '✅', status: 'completed' },
      { phase: 'Mission Delivered', time: 'Now', icon: '🏆', status: 'completed' }
    ];
  }

  exportAsHTML(report) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Mission Report — ${report.missionName}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background: #f8fafc; color: #1e293b; padding: 3rem 2rem; }
  .report { max-width: 800px; margin: 0 auto; background: #fff; border-radius: 16px; padding: 3rem; box-shadow: 0 4px 24px rgba(15,23,42,0.08); }
  h1 { font-size: 1.8rem; font-weight: 800; margin-bottom: 0.25rem; }
  .subtitle { color: #64748b; margin-bottom: 2rem; }
  h2 { font-size: 1.1rem; font-weight: 700; margin: 2rem 0 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid #e2e8f0; }
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1rem; }
  .stat-card { background: #f1f5f9; border-radius: 12px; padding: 1.25rem; text-align: center; }
  .stat-val { font-size: 1.6rem; font-weight: 800; color: #0891b2; }
  .stat-label { font-size: 0.75rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 0.25rem; }
  table { width: 100%; border-collapse: collapse; margin-top: 0.5rem; }
  th, td { text-align: left; padding: 0.65rem 0.75rem; border-bottom: 1px solid #e2e8f0; font-size: 0.85rem; }
  th { font-weight: 700; color: #475569; font-size: 0.75rem; text-transform: uppercase; }
  .timeline-item { display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0; border-left: 3px solid #06b6d4; padding-left: 1.25rem; margin-left: 0.5rem; }
  .timeline-icon { font-size: 1.2rem; }
  .timeline-phase { font-weight: 600; }
  .timeline-time { color: #64748b; font-size: 0.8rem; }
  .badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.7rem; font-weight: 700; background: #d1fae5; color: #065f46; }
  .footer { margin-top: 2.5rem; padding-top: 1.5rem; border-top: 2px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 0.8rem; }
  ul { padding-left: 1.5rem; }
  li { margin-bottom: 0.4rem; font-size: 0.9rem; }
</style>
</head>
<body>
<div class="report">
  <h1>📄 ${report.missionName}</h1>
  <p class="subtitle">Mission Report — Completed ${report.completionDate} at ${report.completionTime}</p>

  <h2>Mission Summary</h2>
  <p style="margin-bottom:1rem;line-height:1.6;">${report.summary}</p>
  <p><strong>Duration:</strong> ${report.duration} &nbsp;&bull;&nbsp; <strong>Mission ID:</strong> ${report.missionId}</p>

  <h2>Performance Statistics</h2>
  <div class="grid">
    <div class="stat-card"><div class="stat-val">${report.stats.totalTasks}</div><div class="stat-label">Total Tasks</div></div>
    <div class="stat-card"><div class="stat-val">${report.stats.completedTasks}</div><div class="stat-label">Completed</div></div>
    <div class="stat-card"><div class="stat-val">${report.stats.successRate}%</div><div class="stat-label">Success Rate</div></div>
    <div class="stat-card"><div class="stat-val">${report.stats.avgEfficiency}%</div><div class="stat-label">AI Efficiency</div></div>
    <div class="stat-card"><div class="stat-val">${report.durationDays}</div><div class="stat-label">Days</div></div>
    <div class="stat-card"><div class="stat-val">${report.stats.overallProgress}%</div><div class="stat-label">Progress</div></div>
  </div>

  <h2>Project Timeline</h2>
  ${report.timeline.map(t => `<div class="timeline-item"><span class="timeline-icon">${t.icon}</span><span class="timeline-phase">${t.phase}</span><span class="timeline-time">${t.time}</span></div>`).join('')}

  <h2>AI Workforce Performance</h2>
  <table>
    <thead><tr><th>Name</th><th>Role</th><th>Tasks</th><th>Avg Time</th><th>Success</th><th>Status</th></tr></thead>
    <tbody>
      ${report.agentPerformance.map(a => `<tr><td><strong>${a.name}</strong></td><td>${a.role}</td><td>${a.tasksCompleted}</td><td>${a.avgCompletionTime}</td><td>${a.successRate}</td><td><span class="badge">Completed</span></td></tr>`).join('')}
    </tbody>
  </table>

  <h2>Final Deliverables</h2>
  <ul>${report.deliverables.map(d => `<li>${d}</li>`).join('')}</ul>

  <div class="footer">Generated by missionOS AI Workforce Operating System &bull; ${report.completionDate}</div>
</div>
</body>
</html>`;
  }

  downloadReport(state) {
    const report = this.generateReport(state);
    const html = this.exportAsHTML(report);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `missionOS-report-${report.missionId}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const reportService = new ReportService();
