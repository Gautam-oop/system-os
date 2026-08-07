import sys

file_path = r'c:\Users\manan\OneDrive\Desktop\AGENTIC I\system-os\js\components\CommandPaletteModal.js'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace block 1
target1 = """  } else if (activeModal === 'new-task') {
    renderNewTaskModal(containerEl);
  }
}"""
replacement1 = """  } else if (activeModal === 'new-task') {
    renderNewTaskModal(containerEl);
  } else if (activeModal === 'task-detail') {
    renderTaskDetailModal(containerEl);
  } else if (activeModal === 'activity-feed') {
    renderActivityFeedModal(containerEl);
  }
}"""
content = content.replace(target1, replacement1)

# Replace block 2
target2 = """    const btn = containerEl.querySelector(`#${id}`);
    if (btn) {
      btn.addEventListener('click', () => store.closeModal());
    }
  });
}"""
replacement2 = """    const btn = containerEl.querySelector(`#${id}`);
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
            return \`
              <div style="display: flex; gap: 0.75rem; line-height: 1.4;">
                <span style="color: #64748b; flex-shrink: 0;">\${log.timestamp || ''}</span>
                <span style="color: #cbd5e1; font-weight: bold; flex-shrink: 0; width: 60px;">[\${log.agentName || 'SYS'}]</span>
                <span style="color: \${color};">\${escapeHtml(log.message)}</span>
              </div>
            \`;
          }).join('')}
        </div>
      </div>
    </div>
  `;

  bindModalDismiss(containerEl);
}"""
content = content.replace(target2, replacement2)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Done')
