import { store } from '../store.js';

export function renderApprovalModal(containerEl) {
  const state = store.getState();
  const approval = state.pendingApproval;
  if (!approval) return;

  containerEl.innerHTML = `
    <div class="modal-overlay" style="display: flex; align-items: center; justify-content: center; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); z-index: 1000;">
      <div class="modal-content animate-scale-up" style="background: var(--bg-primary); border: 1px solid var(--border-subtle); border-radius: 16px; width: 440px; box-shadow: 0 24px 48px rgba(0,0,0,0.2); overflow: hidden;">
        
        <!-- Header -->
        <div style="padding: 1.5rem 1.5rem 1rem 1.5rem; border-bottom: 1px solid var(--border-subtle); background: var(--bg-secondary); display: flex; align-items: center; gap: 1rem;">
          <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(99,102,241,0.1); color: #6366f1; display: flex; align-items: center; justify-content: center;">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
          </div>
          <div>
            <h3 style="margin: 0; font-size: 1.1rem; color: var(--text);">Approval Required</h3>
            <div style="font-size: 0.8rem; color: var(--text-tertiary); margin-top: 0.2rem;">Simulation paused</div>
          </div>
        </div>
        
        <!-- Body -->
        <div style="padding: 1.5rem;">
          <h4 style="margin: 0 0 0.5rem 0; font-size: 1.05rem; color: var(--text);">${approval.title}</h4>
          <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1.5rem;">${approval.description}</p>
          
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${approval.options.map((opt, idx) => `
              <button class="approval-option-btn" data-option="${opt}" style="text-align: left; padding: 1rem; border: 1px solid var(--border-subtle); border-radius: 8px; background: transparent; cursor: pointer; transition: all 0.2s ease; display: flex; justify-content: space-between; align-items: center; color: var(--text);">
                <span style="font-weight: 500;">${opt}</span>
                <span style="font-size: 0.75rem; color: var(--text-tertiary); font-family: var(--font-mono);">Option ${idx + 1}</span>
              </button>
            `).join('')}
          </div>
        </div>
        
        <!-- Footer -->
        <div style="padding: 1rem 1.5rem; border-top: 1px solid var(--border-subtle); background: var(--bg-secondary); display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.75rem; color: var(--text-tertiary);">Decision logged immutably</span>
        </div>
      </div>
    </div>
  `;

  // Interaction Styles
  const style = document.createElement('style');
  style.textContent = `
    .approval-option-btn:hover {
      border-color: #6366f1 !important;
      background: rgba(99,102,241,0.05) !important;
    }
  `;
  containerEl.appendChild(style);

  // Click events
  containerEl.querySelectorAll('.approval-option-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const selectedOption = btn.getAttribute('data-option');
      
      // Update store
      store.resolveApproval(selectedOption);
      
      // Add Decision to Decision Log
      store.addDecision({
        title: approval.title,
        explanation: `The team has finalized the choice for "${approval.title}" to be **${selectedOption}**.`,
        why: 'Human override provided explicit instruction prioritizing this technology stack for the project.',
        alternatives: approval.options.filter(o => o !== selectedOption),
        agent: 'System Manager',
        approvedBy: 'Human Operator',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Approved'
      });
      
      // Announce in War Room
      store.addWarRoomMessage({
        role: 'CEO',
        agentName: 'System Core',
        content: `Decision approved by human operator. We are proceeding with **${selectedOption}** for ${approval.title}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      
      // Remove modal from DOM manually to clear it immediately
      containerEl.innerHTML = '';
    });
  });
}
