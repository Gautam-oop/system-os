import { store } from '../store.js';

export function renderAnalyticsCards(containerEl) {
  const state = store.getState();
  const mission = state.mission || {};
  const tasks = state.tasks || [];
  
  // Calculate dynamic metrics
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = Math.max(tasks.length, 1);
  const taskCompletionRate = Math.round((completedTasks / totalTasks) * 100);
  
  // Mocked AI specific metrics
  const commQuality = 92;
  const blockersCount = tasks.filter(t => t.status === 'blocked').length;
  const decisionConfidence = 96;
  const activeAgents = (state.agents || []).filter(a => a.status === 'Working').length;
  
  // Overall Health Score Calculation
  let healthScore = Math.round(
    (taskCompletionRate * 0.4) + 
    (commQuality * 0.3) + 
    (decisionConfidence * 0.3) - 
    (blockersCount * 5)
  );
  healthScore = Math.min(100, Math.max(0, healthScore)); // clamp 0-100
  
  let healthColor = '#10b981'; // green
  let healthStatus = 'Optimal';
  if (healthScore < 80) { healthColor = '#f59e0b'; healthStatus = 'Attention Needed'; }
  if (healthScore < 60) { healthColor = '#ef4444'; healthStatus = 'Critical'; }

  containerEl.innerHTML = `
    <div class="section-header animate-fade-in" style="margin-bottom: 2rem;">
      <div class="section-title-group">
        <div class="section-icon" style="background: rgba(16, 185, 129, 0.1); color: #10b981;">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
        </div>
        <div>
          <h2 class="section-title">Mission Health Dashboard</h2>
          <p class="section-subtitle">Real-time enterprise analytics and workforce telemetry</p>
        </div>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 1.5rem; margin-bottom: 1.5rem;">
      
      <!-- Primary Health Score Card -->
      <div class="glass-panel animate-fade-in" style="display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 2rem; border-top: 4px solid ${healthColor};">
        <div style="font-size: 0.85rem; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1rem;">Overall Mission Health</div>
        <div style="position: relative; width: 140px; height: 140px; display: flex; justify-content: center; align-items: center; border-radius: 50%; background: conic-gradient(${healthColor} ${healthScore}%, var(--border-subtle) 0);">
          <div style="position: absolute; width: 120px; height: 120px; background: var(--bg-primary); border-radius: 50%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <span style="font-size: 2.5rem; font-weight: 800; color: var(--text);">${healthScore}</span>
            <span style="font-size: 0.75rem; color: ${healthColor}; font-weight: 600;">${healthStatus}</span>
          </div>
        </div>
      </div>

      <!-- Core Metrics Grid -->
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem;">
        ${renderMetricCard('Task Completion', `${taskCompletionRate}%`, 'Based on active sprint', 'rgba(99,102,241,0.1)', '#6366f1')}
        ${renderMetricCard('Communication Quality', `${commQuality}/100`, 'NLP coherence score', 'rgba(168,85,247,0.1)', '#a855f7')}
        ${renderMetricCard('Decision Confidence', `${decisionConfidence}%`, 'Architectural certainty', 'rgba(236,72,153,0.1)', '#ec4899')}
        ${renderMetricCard('Active Blockers', blockersCount.toString(), 'Requires human attention', blockersCount > 0 ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', blockersCount > 0 ? '#ef4444' : '#10b981')}
      </div>
    </div>

    <!-- Secondary Metrics -->
    <h3 style="font-size: 1rem; color: var(--text); margin: 2rem 0 1rem 0;">Operational Telemetry</h3>
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem;">
      ${renderMiniMetric('Mission Progress', `${mission.overallProgress || 0}%`)}
      ${renderMiniMetric('Current Phase', 'Development')}
      ${renderMiniMetric('Active Employees', `${activeAgents} / ${(state.agents || []).length}`)}
      ${renderMiniMetric('Pending Decisions', (state.pendingApproval ? '1' : '0'))}
    </div>
  `;
}

function renderMetricCard(title, value, subtitle, bg, color) {
  return `
    <div class="glass-panel animate-fade-in" style="padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between;">
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
        <div style="width: 8px; height: 8px; border-radius: 50%; background: ${color}; box-shadow: 0 0 10px ${color};"></div>
        <div style="font-size: 0.85rem; color: var(--text-secondary); font-weight: 500;">${title}</div>
      </div>
      <div>
        <div style="font-size: 2rem; font-weight: 700; color: var(--text); font-family: var(--font-mono); margin-bottom: 0.25rem;">${value}</div>
        <div style="font-size: 0.75rem; color: var(--text-tertiary);">${subtitle}</div>
      </div>
    </div>
  `;
}

function renderMiniMetric(title, value) {
  return `
    <div class="glass-panel animate-fade-in" style="padding: 1.25rem; border-left: 3px solid var(--border-subtle);">
      <div style="font-size: 0.75rem; color: var(--text-tertiary); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">${title}</div>
      <div style="font-size: 1.25rem; font-weight: 600; color: var(--text);">${value}</div>
    </div>
  `;
}
