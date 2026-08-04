/* ==========================================================================
   TASK BOARD (DYNAMIC KANBAN WITH FRAMER MOTION MOVEMENTS)
   ========================================================================== */

import { store } from '../store.js';
import { animateStaggeredEntrance } from '../animations.js';

export function renderTaskBoard(containerEl) {
  const state = store.getState();
  const tasks = state.tasks || [];
  const isLoading = store.getLoading().tasks;
  const error = store.getErrors().tasks;

  const columns = [
    { id: 'backlog', title: 'Backlog', icon: '📥' },
    { id: 'in_progress', title: 'In Progress', icon: '⚡' },
    { id: 'ai_executing', title: 'In Review', icon: '🔍' },
    { id: 'verification', title: 'Testing', icon: '🧪' },
    { id: 'completed', title: 'Done', icon: '✅' }
  ];

  if (error) {
    containerEl.innerHTML = `
      <div class="error-banner">
        <div class="error-banner-content">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 2 22 7.86 22 16.14 16.14 2 22 7.86 22 16.14 16.14 2 22 7.86 22 16.14 16.14 2 22 7.86 22 16.14 16.14 2 22 7.86 22 16.14 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line></svg>
          <div><strong>Failed to load Sprint Board</strong><div>${error}</div></div>
        </div>
        <button class="btn btn-danger btn-sm" id="retry-tasks-btn">Retry</button>
      </div>
    `;
    const btn = containerEl.querySelector('#retry-tasks-btn');
    if (btn) btn.addEventListener('click', () => store.loadAllApiData());
    return;
  }

  if (isLoading && tasks.length === 0) {
    containerEl.innerHTML = `
      <div class="kanban-board-container">
        <div class="glass-panel skeleton-card skeleton"></div>
        <div class="glass-panel skeleton-card skeleton"></div>
        <div class="glass-panel skeleton-card skeleton"></div>
      </div>
    `;
    return;
  }

  // If container already rendered, perform in-place DOM movement for task cards!
  const boardGrid = containerEl.querySelector('.kanban-board-container');
  if (boardGrid) {
    tasks.forEach(task => {
      const cardEl = containerEl.querySelector(`[data-task-id="${task.id}"]`);
      const targetColList = containerEl.querySelector(`#col-list-${task.status}`);
      if (cardEl && targetColList && cardEl.parentElement !== targetColList) {
        targetColList.appendChild(cardEl);
        animateStaggeredEntrance([cardEl], 0.02);
      }
    });

    // Update column counts
    columns.forEach(col => {
      const colTasks = tasks.filter(t => t.status === col.id);
      const countEl = containerEl.querySelector(`[data-col-id="${col.id}"] .task-count`);
      if (countEl) countEl.textContent = colTasks.length;
    });
    return;
  }

  containerEl.innerHTML = `
    <div class="section-header">
      <div class="section-title-group">
        <div class="section-icon">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
          </svg>
        </div>
        <div>
          <h2 class="section-title">Sprint 14 Task Board</h2>
          <p class="section-subtitle">Kanban workflow orchestration for human & AI engineering tasks</p>
        </div>
      </div>

      <div style="display: flex; align-items: center; gap: 1rem;">
        <button class="btn btn-primary btn-sm" id="create-task-btn">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          + Add New Task
        </button>
      </div>
    </div>

    <!-- Kanban Grid -->
    <div class="kanban-board-container">
      ${columns.map(col => {
        const colTasks = tasks.filter(t => t.status === col.id);
        return `
          <div class="kanban-column" data-col-id="${col.id}">
            <div class="kanban-column-header">
              <div class="kanban-column-title">
                <span>${col.icon}</span>
                <span>${col.title}</span>
              </div>
              <span class="task-count">${colTasks.length}</span>
            </div>

            <div class="kanban-task-list" id="col-list-${col.id}">
              ${colTasks.length === 0 ? '' : colTasks.map(task => renderTaskCard(task)).join('')}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  const createBtn = containerEl.querySelector('#create-task-btn');
  if (createBtn) {
    createBtn.addEventListener('click', () => {
      store.notify('openModal', { type: 'new-task' });
    });
  }

  initKanbanDragAndDrop(containerEl);

  containerEl.querySelectorAll('.task-shift-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const taskId = btn.getAttribute('data-task-id');
      const targetStatus = btn.getAttribute('data-target-status');
      store.updateTaskStatus(taskId, targetStatus);
    });
  });
}

function renderTaskCard(task) {
  const priorityBadge = task.priority === 'critical' ? 'badge-rose' : task.priority === 'high' ? 'badge-coral' : 'badge-cyan';
  const doneSubtasks = (task.subtasks || []).filter(s => s.done || s.completed).length;
  const totalSubtasks = (task.subtasks || []).length;

  const nextStatusMap = {
    backlog: 'in_progress',
    in_progress: 'ai_executing',
    ai_executing: 'verification',
    verification: 'completed',
    completed: 'backlog'
  };

  const nextLabelMap = {
    backlog: 'In Progress',
    in_progress: 'In Review',
    ai_executing: 'Testing',
    verification: 'Done',
    completed: 'Backlog'
  };

  return `
    <div class="kanban-task-card" draggable="true" data-task-id="${task.id}">
      <div class="task-meta-top">
        <span class="badge ${priorityBadge}">${(task.priority || 'medium').toUpperCase()}</span>
        <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-dim);">${task.id}</span>
      </div>

      <div class="task-title">${task.title}</div>

      <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 0.75rem;">
        <div class="task-agent-chip">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>${task.assignedAgentName || 'Aura'}</span>
        </div>

        ${totalSubtasks > 0 ? `
          <div style="font-size: 0.7rem; font-family: var(--font-mono); color: var(--text-muted);">
            ✓ ${doneSubtasks}/${totalSubtasks}
          </div>
        ` : ''}
      </div>

      <div style="margin-top: 0.75rem; padding-top: 0.5rem; border-top: 1px dashed var(--border-subtle); display: flex; justify-content: flex-end;">
        <button class="btn btn-secondary btn-sm task-shift-btn" data-task-id="${task.id}" data-target-status="${nextStatusMap[task.status] || 'in_progress'}">
          Move → ${nextLabelMap[task.status] || 'Next'}
        </button>
      </div>
    </div>
  `;
}

function initKanbanDragAndDrop(containerEl) {
  let draggedTaskId = null;

  containerEl.querySelectorAll('.kanban-task-card').forEach(card => {
    card.addEventListener('dragstart', (e) => {
      draggedTaskId = card.getAttribute('data-task-id');
      e.dataTransfer.setData('text/plain', draggedTaskId);
      card.style.transform = 'scale(1.03) translateY(-4px)';
      card.style.opacity = '0.7';
      card.style.boxShadow = '0 15px 35px rgba(15, 23, 42, 0.15)';
    });

    card.addEventListener('dragend', () => {
      card.style.transform = 'none';
      card.style.opacity = '1';
      card.style.boxShadow = '';
    });
  });

  containerEl.querySelectorAll('.kanban-column').forEach(col => {
    col.addEventListener('dragover', (e) => {
      e.preventDefault();
      col.style.background = 'rgba(6, 182, 212, 0.06)';
      col.style.borderColor = 'rgba(6, 182, 212, 0.3)';
    });

    col.addEventListener('dragleave', () => {
      col.style.background = '#f8fafc';
      col.style.borderColor = 'var(--border-subtle)';
    });

    col.addEventListener('drop', (e) => {
      e.preventDefault();
      col.style.background = '#f8fafc';
      col.style.borderColor = 'var(--border-subtle)';
      const targetColId = col.getAttribute('data-col-id');
      if (draggedTaskId && targetColId) {
        store.updateTaskStatus(draggedTaskId, targetColId);
      }
    });
  });
}
