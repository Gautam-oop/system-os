import { store } from '../store.js?v=29';

export function renderDecisionLog(containerEl) {
  const state = store.getState();
  const decisions = state.decisions || [];

  containerEl.innerHTML = `
    <div class="section-header animate-fade-in" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem;">
      <div class="section-title-group">
        <div class="section-icon" style="background: rgba(99, 102, 241, 0.1); color: #6366f1;">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"></path><path d="M14 3v5h5M16 13H8M16 17H8M10 9H8"></path></svg>
        </div>
        <div>
          <h2 class="section-title">Decision Log</h2>
          <p class="section-subtitle">Immutable ledger of architectural and strategic approvals</p>
        </div>
      </div>
    </div>

    <div class="decision-log-container" style="padding-top: 2rem; display: flex; flex-direction: column; gap: 1.5rem;">
      ${decisions.length === 0 ? '<div style="text-align: center; color: var(--text-tertiary); margin-top: 2rem;">No decisions logged yet.</div>' : ''}
      ${decisions.map(dec => renderDecisionCard(dec)).join('')}
    </div>
  `;

  // Attach listeners for expanding details
  containerEl.querySelectorAll('.decision-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetId = btn.getAttribute('data-target');
      const detailEl = document.getElementById(targetId);
      if (detailEl) {
        const isHidden = detailEl.style.display === 'none';
        detailEl.style.display = isHidden ? 'block' : 'none';
        btn.innerHTML = isHidden ? 'Hide Details ▲' : 'View Details ▼';
      }
    });
  });
}

function renderDecisionCard(dec) {
  const statusColor = dec.status === 'Approved' ? '#10b981' : (dec.status === 'Pending' ? '#f59e0b' : '#ef4444');
  return `
    <div class="decision-card animate-fade-in" style="background: var(--bg-primary); border: 1px solid var(--border-subtle); border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
      <div style="padding: 1.5rem; display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid var(--border-subtle);">
        <div>
          <h3 style="margin: 0 0 0.5rem 0; font-size: 1.1rem; color: var(--text);">${dec.title}</h3>
          <div style="font-size: 0.8rem; color: var(--text-secondary); display: flex; gap: 1rem; align-items: center;">
            <span style="display: flex; align-items: center; gap: 0.25rem;"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> ${dec.timestamp}</span>
            <span style="display: flex; align-items: center; gap: 0.25rem;"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> ${dec.agent}</span>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem;">
          <span style="background: ${statusColor}15; color: ${statusColor}; padding: 0.25rem 0.75rem; border-radius: 99px; font-size: 0.75rem; font-weight: 600; font-family: var(--font-mono); border: 1px solid ${statusColor}30;">
            ${dec.status.toUpperCase()}
          </span>
          <button class="btn btn-sm btn-secondary decision-toggle" data-target="detail-${dec.id}" style="font-size: 0.75rem;">View Details ▼</button>
        </div>
      </div>
      
      <div id="detail-${dec.id}" style="display: none; padding: 1.5rem; background: var(--bg-secondary); border-top: 1px solid var(--border-subtle);">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
          <div>
            <h4 style="font-size: 0.75rem; color: var(--text-tertiary); text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.05em;">Explanation</h4>
            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; margin: 0;">${dec.explanation}</p>
          </div>
          <div>
            <h4 style="font-size: 0.75rem; color: var(--text-tertiary); text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.05em;">Why this decision?</h4>
            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; margin: 0;">${dec.why}</p>
          </div>
        </div>
        
        <div style="margin-top: 1.5rem;">
          <h4 style="font-size: 0.75rem; color: var(--text-tertiary); text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.05em;">Alternatives Considered</h4>
          <ul style="margin: 0; padding-left: 1.5rem; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6;">
            ${dec.alternatives.map(alt => `<li>${alt}</li>`).join('')}
          </ul>
        </div>
        
        <div style="margin-top: 1.5rem; font-size: 0.8rem; color: var(--text-tertiary); display: flex; gap: 0.5rem; align-items: center; padding-top: 1rem; border-top: 1px solid var(--border-subtle);">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          Approved by: <strong style="color: var(--text);">${dec.approvedBy || 'Human Override'}</strong>
        </div>
      </div>
    </div>
  `;
}
