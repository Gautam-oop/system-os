/* ==========================================================================
   COMMAND PALETTE & NEW TASK MODAL CONTROLLER (APPLE SPOTLIGHT STYLE)
   ========================================================================== */

import { store } from '../store.js';

export function renderModalHost(containerEl) {
  const activeModal = store.getActiveModal();

  if (!activeModal) {
    containerEl.innerHTML = '';
    return;
  }

  if (activeModal === 'command-palette') {
    renderCommandPalette(containerEl);
  } else if (activeModal === 'agent-detail') {
    renderAgentDetailModal(containerEl);
  } else if (activeModal === 'new-task') {
    renderNewTaskModal(containerEl);
  }
}

function renderCommandPalette(containerEl) {
  containerEl.innerHTML = `
    <div class="modal-overlay" id="modal-overlay">
      <div class="modal-content" style="max-width: 650px; padding: 1.25rem;">
        <div style="display: flex; align-items: center; gap: 0.75rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.85rem;">
          <svg width="20" height="20" fill="none" stroke="var(--cyan)" stroke-width="2.5" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            id="cmd-input"
            placeholder="Type a command or search missionOS tasks, team, docs..."
            style="flex: 1; background: transparent; border: none; outline: none; color: var(--text-main); font-size: 1.05rem; font-family: var(--font-sans);"
            autofocus
          />
          <button class="btn btn-secondary btn-sm" id="close-modal-btn">ESC</button>
        </div>

        <div style="padding: 1rem 0 0.5rem 0;" id="cmd-results">
          <div style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono); margin-bottom: 0.5rem;">QUICK ACTIONS</div>
          <div class="cmd-item" data-action="tab-overview" style="padding: 0.65rem; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: space-between;">
            <span>Go to <strong>Project Overview</strong></span>
            <span class="badge badge-cyan">NAVIGATE</span>
          </div>
          <div class="cmd-item" data-action="tab-agents" style="padding: 0.65rem; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: space-between;">
            <span>Go to <strong>AI Teammates Panel</strong></span>
            <span class="badge badge-cyan">NAVIGATE</span>
          </div>
          <div class="cmd-item" data-action="tab-tasks" style="padding: 0.65rem; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: space-between;">
            <span>Open <strong>Sprint Task Board</strong></span>
            <span class="badge badge-cyan">NAVIGATE</span>
          </div>
          <div class="cmd-item" data-action="defcon-toggle" style="padding: 0.65rem; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: space-between;">
            <span>Trigger <strong>Sprint 14 Status Sync</strong></span>
            <span class="badge badge-purple">ACTION</span>
          </div>
        </div>
      </div>
    </div>
  `;

  bindModalDismiss(containerEl);

  containerEl.querySelectorAll('.cmd-item').forEach(item => {
    item.addEventListener('click', () => {
      const action = item.getAttribute('data-action');
      if (action === 'tab-overview') store.setActiveTab('overview');
      if (action === 'tab-agents') store.setActiveTab('agents');
      if (action === 'tab-tasks') store.setActiveTab('tasks');
      if (action === 'defcon-toggle') store.triggerEmergencyOverride();
      store.closeModal();
    });
  });
}

function renderAgentDetailModal(containerEl) {
  const agentId = store.getSelectedAgentId();
  const agent = (store.getState().agents || []).find(a => a.id === agentId);

  if (!agent) {
    store.closeModal();
    return;
  }

  containerEl.innerHTML = `
    <div class="modal-overlay" id="modal-overlay">
      <div class="modal-content" style="max-width: 680px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div class="agent-avatar" style="background: rgba(6, 182, 212, 0.12); color: #0891b2; border-color: rgba(6, 182, 212, 0.25);">
              ${(agent.name || 'AG').substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 style="font-size: 1.3rem;">${agent.name} (${agent.code || agent.id})</h2>
              <div style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--font-mono);">${agent.role}</div>
            </div>
          </div>
          <button class="btn btn-secondary btn-sm" id="close-modal-btn">✕</button>
        </div>

        <div style="margin-bottom: 1.25rem; padding: 1rem; background: #f8fafc; border-radius: 10px; border: 1px solid var(--border-subtle);">
          <div style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono); margin-bottom: 0.35rem;">CURRENT ACTIVE TASK</div>
          <div style="font-weight: 600; color: #0891b2;">${agent.activeOperation || agent.currentTask || 'Coding...'}</div>
        </div>

        <h4 style="font-size: 0.85rem; font-family: var(--font-mono); color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase;">Core Technical Capabilities</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem;">
          ${(agent.capabilities || []).map(c => `<span class="badge badge-purple">${c}</span>`).join('')}
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 1rem; border-top: 1px solid var(--border-subtle); padding-top: 1rem;">
          <button class="btn btn-secondary" id="close-modal-btn-2">Close</button>
          <button class="btn btn-primary" id="toggle-agent-modal-btn">
            ${agent.status === 'Idle' ? 'Assign Task' : 'Set Idle'}
          </button>
        </div>
      </div>
    </div>
  `;

  bindModalDismiss(containerEl);

  const toggleBtn = containerEl.querySelector('#toggle-agent-modal-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      store.toggleAgentOverride(agent.id);
      store.closeModal();
    });
  }
}

function renderNewTaskModal(containerEl) {
  const agents = store.getState().agents || [];

  containerEl.innerHTML = `
    <div class="modal-overlay" id="modal-overlay">
      <div class="modal-content" style="max-width: 550px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
          <h2 style="font-size: 1.3rem;">Create Engineering Task</h2>
          <button class="btn btn-secondary btn-sm" id="close-modal-btn">✕</button>
        </div>

        <form id="new-task-form" style="display: flex; flex-direction: column; gap: 1rem;">
          <div>
            <label style="display: block; font-size: 0.8rem; font-family: var(--font-mono); color: var(--text-muted); margin-bottom: 0.35rem;">TASK TITLE</label>
            <input type="text" id="task-title-input" required placeholder="e.g. Refactor API Route Handler" style="width: 100%; padding: 0.6rem 0.8rem; border-radius: 8px; background: #f8fafc; border: 1px solid var(--border-subtle); color: var(--text-main); font-size: 0.9rem;" />
          </div>

          <div style="margin-top: 1rem;">
            <label style="display: block; font-size: 0.8rem; font-family: var(--font-mono); color: var(--text-muted); margin-bottom: 0.35rem;">PRIORITY</label>
            <select id="task-priority-select" style="width: 100%; padding: 0.6rem 0.8rem; border-radius: 8px; background: #f8fafc; border: 1px solid var(--border-subtle); color: var(--text-main); font-size: 0.9rem;">
              <option value="critical">CRITICAL</option>
              <option value="high" selected>HIGH</option>
              <option value="medium">MEDIUM</option>
              <option value="low">LOW</option>
            </select>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem;">
            <button type="button" class="btn btn-secondary" id="close-modal-btn-3">Cancel</button>
            <button type="submit" class="btn btn-primary">Create Task</button>
          </div>
        </form>
      </div>
    </div>
  `;

  bindModalDismiss(containerEl);

  const form = containerEl.querySelector('#new-task-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = containerEl.querySelector('#task-title-input').value.trim();
    const priority = containerEl.querySelector('#task-priority-select').value;

    if (!title) return;

    store.addNewTask({
      title,
      assignedAgentId: 'auto',
      priority,
      status: 'ai_executing'
    });

    store.closeModal();
  });
}

function bindModalDismiss(containerEl) {
  const overlay = containerEl.querySelector('#modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) store.closeModal();
    });
  }

  ['close-modal-btn', 'close-modal-btn-2', 'close-modal-btn-3'].forEach(id => {
    const btn = containerEl.querySelector(`#${id}`);
    if (btn) {
      btn.addEventListener('click', () => store.closeModal());
    }
  });
}
