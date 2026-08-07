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
  } else if (activeModal === 'task-detail') {
    renderTaskDetailModal(containerEl);
  } else if (activeModal === 'activity-feed') {
    renderActivityFeedModal(containerEl);
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

function renderTaskDetailModal(containerEl) {
  const taskId = store.selectedTaskId;
  const state = store.getState();
  const task = (state.tasks || []).find(t => t.id === taskId);

  if (!task) {
    store.closeModal();
    return;
  }

  const agent = (state.agents || []).find(a => a.id === task.assignedAgentId || a.name === task.assignedAgentName) || {
    name: task.assignedAgentName || 'Aura',
    role: 'Lead Engineer',
    avatarBg: 'rgba(99,102,241,0.15)',
    avatarColor: '#6366f1'
  };

  const priorityBadge = task.priority === 'critical' ? 'badge-rose' : task.priority === 'high' ? 'badge-coral' : 'badge-cyan';
  const statusBadgeMap = {
    backlog: { class: 'badge-secondary', text: 'Backlog' },
    in_progress: { class: 'badge-cyan', text: 'In Progress' },
    ai_executing: { class: 'badge-purple', text: 'In Review' },
    verification: { class: 'badge-amber', text: 'Testing' },
    completed: { class: 'badge-emerald', text: 'Completed' }
  };
  const statusInfo = statusBadgeMap[task.status] || { class: 'badge-secondary', text: task.status };

  const subtasks = task.subtasks || [
    { title: 'Requirements & Architectural Specs', done: true, status: 'completed' },
    { title: 'Component Implementation & Styling', done: task.progress > 40, status: task.progress > 40 ? 'completed' : 'executing' },
    { title: 'AST Code Verification & Unit Tests', done: task.progress > 80, status: task.progress > 80 ? 'completed' : 'pending' },
    { title: 'CI/CD Deployment & Monitoring', done: task.progress >= 100, status: task.progress >= 100 ? 'completed' : 'pending' }
  ];

  const assignedAgents = task.assignedAgents || [
    { name: task.assignedAgentName || 'Aura', task: 'Lead Architecture & Implementation', status: 'Working' },
    { name: 'Spectre', task: 'Automated E2E Verification', status: 'Pending' },
    { name: 'Titan', task: 'Backend Connection Pooling & Indexing', status: 'Pending' }
  ];

  const logs = agent.detailLogs || [
    { ts: '14:20:05', message: `Initialising task [${task.id}]...`, severity: 'INFO' },
    { ts: '14:20:12', message: `Executing automated phase checks...`, severity: 'INFO' },
    { ts: '14:20:25', message: `Subtask validation 100% complete.`, severity: 'SUCCESS' }
  ];

  containerEl.innerHTML = `
    <div class="modal-overlay" id="modal-overlay">
      <div class="modal-content task-detail-modal-content" style="max-width: 750px; width: 92vw; padding: 1.75rem; border-radius: 16px;">
        
        <!-- Header Top -->
        <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.25rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.5rem;">
              <span class="badge ${priorityBadge}">${(task.priority || 'medium').toUpperCase()}</span>
              <span class="badge ${statusInfo.class}">${statusInfo.text}</span>
              <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-tertiary); font-weight: 700;">${task.id}</span>
            </div>
            <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--text); line-height: 1.3; margin: 0; text-align: left;">${escapeHtml(task.title)}</h2>
          </div>
          <button class="btn btn-secondary btn-sm" id="close-modal-btn" style="border-radius: 8px;">✕</button>
        </div>

        <!-- Content Grid (Two Column Layout) -->
        <div class="task-modal-grid" style="display: grid; grid-template-columns: 1.3fr 1fr; gap: 1.5rem; max-height: 65vh; overflow-y: auto; padding-right: 0.25rem; text-align: left;">
          
          <!-- Left Column: Objective, Subtasks & Assigned Agents -->
          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            
            <!-- Description Box -->
            <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 1rem;">
              <div style="font-size: 0.72rem; font-family: var(--font-mono); font-weight: 700; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.4rem;">TASK OBJECTIVE</div>
              <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5; margin: 0;">
                ${task.description || `Autonomous engineering task [${task.id}] executed by the missionOS swarm pipeline. All code changes undergo zero-trust security scan and Cypress E2E regression verification.`}
              </p>
            </div>

            <!-- Subtasks Breakdown -->
            <div>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.6rem;">
                <div style="font-size: 0.75rem; font-family: var(--font-mono); font-weight: 700; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.05em;">SUBTASK PROGRESS</div>
                <div style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--cyan); font-weight: 700;">
                  ${subtasks.filter(s => s.done || s.status === 'completed').length}/${subtasks.length} DONE (${task.progress || 0}%)
                </div>
              </div>
              <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                ${subtasks.map(s => `
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 0.75rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); border-radius: 8px; font-size: 0.82rem;">
                    <div style="display: flex; align-items: center; gap: 0.6rem;">
                      <span style="color: ${s.done || s.status === 'completed' ? '#10b981' : s.status === 'executing' ? '#6366f1' : '#64748b'}; font-weight: 700;">
                        ${s.done || s.status === 'completed' ? '✓' : s.status === 'executing' ? '⚡' : '○'}
                      </span>
                      <span style="color: ${s.done || s.status === 'completed' ? 'var(--text-muted)' : 'var(--text)'}; text-decoration: ${s.done || s.status === 'completed' ? 'line-through' : 'none'}; font-weight: 600;">
                        ${escapeHtml(s.title || s.name || 'Subtask step')}
                      </span>
                    </div>
                    <span class="badge ${s.done || s.status === 'completed' ? 'badge-emerald' : s.status === 'executing' ? 'badge-purple' : 'badge-secondary'}" style="font-size: 0.65rem;">
                      ${(s.status || (s.done ? 'completed' : 'pending')).toUpperCase()}
                    </span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Assigned Agents Swarm -->
            <div>
              <div style="font-size: 0.75rem; font-family: var(--font-mono); font-weight: 700; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.6rem;">ASSIGNED SWARM TEAMMATES</div>
              <div style="display: flex; flex-direction: column; gap: 0.4rem;">
                ${assignedAgents.map(a => `
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; background: rgba(99,102,241,0.04); border: 1px solid rgba(99,102,241,0.15); border-radius: 8px; font-size: 0.8rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                      <span style="font-size: 0.9rem;">🤖</span>
                      <strong style="color: var(--text);">${escapeHtml(a.name)}</strong>
                    </div>
                    <span style="color: var(--text-tertiary); font-size: 0.75rem;">${escapeHtml(a.task)}</span>
                  </div>
                `).join('')}
              </div>
            </div>

          </div>

          <!-- Right Column: Lead Agent & Execution Terminal -->
          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            
            <!-- Lead Agent Card -->
            <div style="padding: 1rem; background: rgba(99,102,241,0.06); border: 1px solid rgba(99,102,241,0.2); border-radius: 12px;">
              <div style="font-size: 0.7rem; font-family: var(--font-mono); font-weight: 700; color: var(--cyan); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.6rem;">PRIMARY ASSIGNED AGENT</div>
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <div style="width: 40px; height: 40px; border-radius: 10px; background: ${agent.avatarBg || 'rgba(99,102,241,0.2)'}; color: ${agent.avatarColor || '#6366f1'}; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.1rem; border: 1px solid rgba(99,102,241,0.3);">
                  ${(agent.name || 'AI').substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style="font-weight: 800; color: var(--text); font-size: 0.95rem;">${escapeHtml(agent.name)}</div>
                  <div style="font-size: 0.75rem; color: var(--text-tertiary); font-family: var(--font-mono);">${escapeHtml(agent.role || 'AI Engineering Specialist')}</div>
                </div>
              </div>
            </div>

            <!-- Execution Terminal -->
            <div>
              <div style="font-size: 0.75rem; font-family: var(--font-mono); font-weight: 700; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">REAL-TIME AGENT LOGS</div>
              <div style="background: #09090b; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 0.75rem; font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; max-height: 180px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.4rem;">
                ${logs.slice(-8).map(l => `
                  <div style="display: flex; gap: 0.5rem; line-height: 1.35;">
                    <span style="color: #64748b;">${l.ts || ''}</span>
                    <span style="color: ${l.severity === 'SUCCESS' ? '#10b981' : l.severity === 'WARN' ? '#f59e0b' : '#6366f1'};">${escapeHtml(l.message)}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Quick Status Change Actions -->
            <div>
              <div style="font-size: 0.75rem; font-family: var(--font-mono); font-weight: 700; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">UPDATE TASK STATUS</div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                <button class="btn btn-secondary btn-sm shift-modal-status-btn" data-status="in_progress" style="font-size: 0.75rem;">⚡ In Progress</button>
                <button class="btn btn-secondary btn-sm shift-modal-status-btn" data-status="ai_executing" style="font-size: 0.75rem;">🔍 In Review</button>
                <button class="btn btn-secondary btn-sm shift-modal-status-btn" data-status="verification" style="font-size: 0.75rem;">🧪 Testing</button>
                <button class="btn btn-primary btn-sm shift-modal-status-btn" data-status="completed" style="font-size: 0.75rem;">✅ Done</button>
              </div>
            </div>

          </div>

        </div>

        <!-- Footer -->
        <div style="display: flex; justify-content: flex-end; gap: 1rem; border-top: 1px solid var(--border-subtle); padding-top: 1rem; margin-top: 1.25rem;">
          <button class="btn btn-secondary" id="close-modal-btn-task">Close</button>
        </div>
      </div>
    </div>
  `;

  bindModalDismiss(containerEl);

  const closeBtn2 = containerEl.querySelector('#close-modal-btn-task');
  if (closeBtn2) closeBtn2.addEventListener('click', () => store.closeModal());

  // Wire status update buttons
  containerEl.querySelectorAll('.shift-modal-status-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const newStatus = btn.getAttribute('data-status');
      store.updateTaskStatus(task.id, newStatus);
      store.closeModal();
    });
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function bindModalDismiss(containerEl) {
  const overlay = containerEl.querySelector('#modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) store.closeModal();
    });
  }

  ['close-modal-btn', 'close-modal-btn-2', 'close-modal-btn-3', 'close-modal-btn-task'].forEach(id => {
    const btn = containerEl.querySelector(`#${id}`);
    if (btn) {
      btn.addEventListener('click', () => store.closeModal());
    }
  });
}

function renderActivityFeedModal(containerEl) {
  const state = store.getState();
  const logs = state.activityLogs || [];

  containerEl.innerHTML = `
    <div class="modal-overlay" id="modal-overlay">
      <div class="modal-content" style="max-width: 700px; padding: 1.5rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div class="section-icon" style="background: rgba(139,92,246,0.1); color: #8b5cf6;">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <div>
              <h2 style="font-size: 1.25rem; font-weight: 700;">Activity Feed</h2>
              <div style="font-size: 0.8rem; color: var(--text-tertiary);">Recent operations and logs</div>
            </div>
          </div>
          <button class="btn btn-secondary btn-sm" id="close-modal-btn">✕</button>
        </div>

        <div style="background: #09090b; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 1rem; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; max-height: 50vh; overflow-y: auto; display: flex; flex-direction: column; gap: 0.6rem;">
          ${logs.length === 0 ? '<div style="color: var(--text-tertiary); text-align: center;">No recent activity logs.</div>' : logs.map(log => {
            let color = '#6366f1';
            if (log.severity === 'SUCCESS') color = '#10b981';
            if (log.severity === 'WARN') color = '#f59e0b';
            return `
              <div style="display: flex; gap: 0.75rem; line-height: 1.4;">
                <span style="color: #64748b; flex-shrink: 0;">${log.timestamp || ''}</span>
                <span style="color: #cbd5e1; font-weight: bold; flex-shrink: 0; width: 60px;">[${log.agentName || 'SYS'}]</span>
                <span style="color: ${color};">${escapeHtml(log.message)}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;

  bindModalDismiss(containerEl);
}
