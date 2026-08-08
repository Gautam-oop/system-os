/* ==========================================================================
   MISSION OVERVIEW COMPONENT (GRAND CENTERPIECE VIEW)
   ========================================================================== */

import { store } from '../store.js?v=29';
import { animateCounter, animateProgressBar } from '../animations.js?v=29';

export function renderMissionOverview(containerEl, forceRender = false) {
  const state = store.getState();
  const mission = state.mission || {};
  const tasks = state.tasks || [];
  const objectives = mission.objectives || [];
  const logs = state.activityLogs || [];

  const progressVal = mission.overallProgress || 68;
  const completedVal = mission.completedTasksCount || 428;
  const pendingVal = mission.pendingTasksCount || 14;
  
  const intell = state.missionIntelligence || {};
  const explorer = state.projectExplorer || { files: [] };

  // Group tasks by project
  const tasksByProject = {};
  const displayObjectives = [...objectives];

  objectives.forEach(obj => tasksByProject[obj.id] = []);
  
  tasks.forEach(task => {
    if (task.objectiveId && tasksByProject[task.objectiveId]) {
      tasksByProject[task.objectiveId].push(task);
    } else {
      // Promote independent task to a full Project Tile
      const pseudoObjId = `pseudo_${task.id}`;
      displayObjectives.unshift({
        id: pseudoObjId,
        code: task.id,
        name: task.title,
        status: task.status === 'ai_executing' ? 'IN_PROGRESS' : task.status.toUpperCase(),
        progressPercentage: task.progress || 25
      });
      tasksByProject[pseudoObjId] = [task];
    }
  });

  // In-place updates if already structured
  const existingProgText = containerEl.querySelector('#os-prog-text');
  if (existingProgText && !forceRender) {
    existingProgText.textContent = `${progressVal}%`;
    const heroFill = containerEl.querySelector('.hero-progress-fill');
    if (heroFill) animateProgressBar(heroFill, progressVal);

    // Update stats counters
    const statProg = containerEl.querySelector('#ostat-progress');
    if (statProg) animateCounter(statProg, progressVal, '', '%');

    // Update Intelligence Panel
    const currEng = containerEl.querySelector('#intell-engineer');
    if (currEng) currEng.textContent = intell.currentEngineer || 'Waiting...';
    
    const currFile = containerEl.querySelector('#intell-file');
    if (currFile) currFile.textContent = intell.currentFile || 'N/A';
    
    const currTask = containerEl.querySelector('#intell-task');
    if (currTask) currTask.textContent = intell.currentTask || 'N/A';
    
    const remArts = containerEl.querySelector('#intell-artifacts');
    if (remArts) remArts.textContent = intell.remainingArtifacts;
    
    const buildProg = containerEl.querySelector('#intell-build');
    if (buildProg) buildProg.textContent = `${intell.buildProgress}%`;
    
    const valStat = containerEl.querySelector('#intell-val');
    if (valStat) {
       valStat.textContent = intell.validationStatus;
       valStat.style.color = intell.validationStatus === 'Failed' ? '#ef4444' : (intell.validationStatus === 'Passed' ? '#10b981' : 'var(--text-secondary)');
    }
    
    const confScore = containerEl.querySelector('#intell-conf');
    if (confScore) confScore.textContent = `${intell.confidenceScore}%`;

    // Update Project Explorer
    const explorerBody = containerEl.querySelector('#os-explorer-body');
    if (explorerBody) {
        explorerBody.innerHTML = explorer.files.length > 0 ? explorer.files.map(f => `
            <div style="padding: 4px 8px; font-size: 0.75rem; border-bottom: 1px solid var(--border-subtle); display: flex; align-items: center; gap: 6px;">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                ${f}
            </div>
        `).join('') : '<div style="padding: 8px; color: var(--text-tertiary); font-size: 0.8rem; font-style: italic;">Workspace empty</div>';
    }

    // Update Project Tiles in place
    displayObjectives.forEach(obj => {
      const tile = containerEl.querySelector(`[data-project-id="${obj.id}"]`);
      if (tile) {
        const fill = tile.querySelector('.progress-bar-fill');
        if (fill) animateProgressBar(fill, obj.progressPercentage || 0);

        const pct = tile.querySelector('.task-node-pct');
        if (pct) pct.textContent = `${obj.progressPercentage || 0}%`;

        // Dynamically update tasks inside the project tile
        const taskListContainer = tile.querySelector('.task-subtask-list');
        if (taskListContainer) {
          const projectTasks = tasksByProject[obj.id] || [];
          taskListContainer.innerHTML = projectTasks.length > 0 ? projectTasks.map(task => `
            <div style="border: 1px solid var(--border-subtle); border-radius: 8px; padding: 0.75rem; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.02); margin-bottom: 0.5rem;">
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom: 0.5rem;">
                <span style="font-weight: 700; font-size: 0.82rem; color: #09090b;">${task.title}</span>
              </div>
              <div style="display:flex; align-items:center; gap: 0.5rem; margin-bottom: 0.75rem; font-size: 0.65rem; font-family: var(--font-mono);">
                <span style="padding: 0.2rem 0.4rem; background: ${task.status === 'completed' ? 'rgba(16,185,129,0.1)' : 'rgba(99,102,241,0.1)'}; color: ${task.status === 'completed' ? '#10b981' : '#6366f1'}; border-radius: 4px; font-weight: 700;">
                  ${task.assignedAgentName || 'Agent'}
                </span>
                <span style="color: #64748b;">•</span>
                <span style="color: #64748b;">${task.status === 'ai_executing' ? 'AI EXECUTING' : task.status.replace('_', ' ').toUpperCase()}</span>
              </div>
              
              <div style="display: flex; flex-direction: column; gap: 0.4rem; margin-left: 0.25rem; padding-left: 0.5rem; border-left: 2px solid #e2e8f0;">
                ${(task.subtasks || []).map(sub => `
                  <div class="task-subtask-item ${sub.status}" style="font-size: 0.75rem;">
                    <div class="subtask-icon">
                      ${sub.done ? '<svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>' : (sub.status === 'executing' ? '<div class="pulse-dot"></div>' : '<div class="empty-dot"></div>')}
                    </div>
                    <span class="subtask-title" style="color: ${sub.done ? '#09090b' : sub.status === 'executing' ? '#6366f1' : '#94a3b8'}; ${sub.status === 'executing' ? 'font-weight: 600;' : ''}">${sub.title}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('') : `
            <div style="font-size: 0.8rem; color: #94a3b8; font-style: italic; padding: 0.5rem 0;">No active tasks assigned yet.</div>
          `;
        }
      } else {
        renderMissionOverview(containerEl, true);
        return;
      }
    });

    // Update Terminal Console in place (append latest logs)
    const termBody = containerEl.querySelector('#os-terminal-body');
    if (termBody && logs.length > 0) {
      const termRows = termBody.querySelectorAll('.terminal-log-row');
      const renderedIds = Array.from(termRows).map(row => row.getAttribute('data-log-id'));
      
      // Render missing logs
      logs.slice(0, 15).reverse().forEach(log => {
        if (!renderedIds.includes(log.id)) {
          const logDiv = document.createElement('div');
          logDiv.className = 'terminal-log-row';
          logDiv.setAttribute('data-log-id', log.id);
          logDiv.innerHTML = `
            <span class="term-time">[${log.timestamp || '00:00'}]</span>
            <span class="term-agent">[${log.agentName || 'System'}]</span>
            <span class="term-msg">${log.message}</span>
          `;
          termBody.appendChild(logDiv);
          termBody.scrollTop = termBody.scrollHeight;
        }
      });
    }
    return;
  }


  // Initial grand desktop view layout
  containerEl.innerHTML = `
    <!-- Large OS Header -->
    <div class="os-canvas-header animate-fade-in">
      <div class="mission-tag" style="justify-content: center;">
        <span class="status-dot active"></span>
        <span>${mission.codeName || 'MISSIONOS CORE'}</span>
      </div>
      <h1 class="os-mission-title">${mission.name || 'missionOS (Autonomous AI Engineering OS)'}</h1>
      <p class="os-mission-subtitle">${mission.description || 'Managing autonomous AI software engineers for high-velocity project execution.'}</p>
    </div>

    <!-- Immersive Desktop Container -->
    <div class="os-centerpiece-container">
      
      <!-- Left: Active Engineering Project Tiles -->
      <div class="glass-panel os-workforce-stage no-hover">
        <div class="stage-title-row">
          <h2 class="stage-heading">
            <svg width="20" height="20" fill="none" stroke="var(--accent)" stroke-width="2.5" viewBox="0 0 24 24">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
            Active Projects & Objectives
          </h2>
          <span class="badge badge-cyan" id="os-prog-text">${progressVal}% Complete</span>
        </div>

        <div class="progress-bar-bg" style="height: 8px; margin-top: -0.5rem; margin-bottom: 1.5rem;">
          <div class="progress-bar-fill hero-progress-fill" style="width: 0%;"></div>
        </div>

        <!-- Project Tiles Grid -->
        <div class="task-tiles-grid">
          ${displayObjectives.length > 0 ? displayObjectives.map(obj => {
            const projectTasks = tasksByProject[obj.id] || [];
            
            return `
            <div class="task-tile-card" data-project-id="${obj.id}">
              
              <div class="task-tile-header">
                <span class="task-tile-id">[${obj.code}]</span>
                <span class="badge ${obj.status === 'IN_PROGRESS' ? 'badge-cyan' : obj.status === 'COMPLETED' ? 'badge-emerald' : 'badge-secondary'}">
                  ${obj.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <h3 class="task-tile-title">${obj.name}</h3>

              <div class="task-subtask-section">
                <div class="task-subtask-header">Tasks Happening for this Project:</div>
                <div class="task-subtask-list" style="margin-top: 0.25rem;">
                  ${projectTasks.length > 0 ? projectTasks.map(task => `
                    <div style="border: 1px solid var(--border-subtle); border-radius: 8px; padding: 0.75rem; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.02); margin-bottom: 0.5rem;">
                      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom: 0.5rem;">
                        <span style="font-weight: 700; font-size: 0.82rem; color: #09090b;">${task.title}</span>
                      </div>
                      <div style="display:flex; align-items:center; gap: 0.5rem; margin-bottom: 0.75rem; font-size: 0.65rem; font-family: var(--font-mono);">
                        <span style="padding: 0.2rem 0.4rem; background: ${task.status === 'completed' ? 'rgba(16,185,129,0.1)' : 'rgba(99,102,241,0.1)'}; color: ${task.status === 'completed' ? '#10b981' : '#6366f1'}; border-radius: 4px; font-weight: 700;">
                          ${task.assignedAgentName || 'Agent'}
                        </span>
                        <span style="color: #64748b;">•</span>
                        <span style="color: #64748b;">${task.status === 'ai_executing' ? 'AI EXECUTING' : task.status.replace('_', ' ').toUpperCase()}</span>
                      </div>
                      
                      <div style="display: flex; flex-direction: column; gap: 0.4rem; margin-left: 0.25rem; padding-left: 0.5rem; border-left: 2px solid #e2e8f0;">
                        ${(task.subtasks || []).map(sub => `
                          <div class="task-subtask-item ${sub.status}" style="font-size: 0.75rem;">
                            <div class="subtask-icon">
                              ${sub.done ? '<svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>' : (sub.status === 'executing' ? '<div class="pulse-dot"></div>' : '<div class="empty-dot"></div>')}
                            </div>
                            <span class="subtask-title" style="color: ${sub.done ? '#09090b' : sub.status === 'executing' ? '#6366f1' : '#94a3b8'}; ${sub.status === 'executing' ? 'font-weight: 600;' : ''}">${sub.title}</span>
                          </div>
                        `).join('')}
                      </div>
                    </div>
                  `).join('') : `
                    <div style="font-size: 0.8rem; color: #94a3b8; font-style: italic; padding: 0.5rem 0;">No active tasks assigned yet.</div>
                  `}
                </div>
              </div>

              <div class="agent-node-progress" style="margin-top: auto; padding-top: 1rem;">
                <div style="display:flex;justify-content:space-between;font-size:0.7rem;font-family:var(--font-mono);color:var(--text-tertiary);">
                  <span>PROJECT PROGRESS</span>
                  <span class="task-node-pct">${obj.progressPercentage || 0}%</span>
                </div>
                <div class="progress-bar-bg" style="height:5px; margin-top: 0.35rem;">
                  <div class="progress-bar-fill" style="width:0%;"></div>
                </div>
              </div>

            </div>
          `}).join('') : `
            <div style="padding: 2rem; text-align: center; color: var(--text-muted); font-size: 0.9rem; border: 1px dashed rgba(0,0,0,0.1); border-radius: 12px; grid-column: 1 / -1;">
              No active projects found.
            </div>
          `}
        </div>
      </div>

      <!-- Right: Live Compilation Stream & Secondary Analytics -->
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        
        <!-- Live Terminal logs -->
        <div class="glass-panel os-terminal-panel no-hover">
          <div class="os-terminal-header">
            <div class="terminal-dots">
              <span class="terminal-dot red"></span>
              <span class="terminal-dot yellow"></span>
              <span class="terminal-dot green"></span>
            </div>
            <div class="terminal-title">LIVE COMPILATION STREAM</div>
          </div>
          <div class="os-terminal-body" id="os-terminal-body">
            ${logs.slice(0, 12).reverse().map(log => `
              <div class="terminal-log-row" data-log-id="${log.id}">
                <span class="term-time">[${log.timestamp || '00:00'}]</span>
                <span class="term-agent">[${log.agentName || 'System'}]</span>
                <span class="term-msg">${log.message}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Live Mission Intelligence Panel -->
        <div class="glass-panel no-hover">
            <div class="stage-title-row" style="margin-bottom: 10px;">
                <h2 class="stage-heading" style="font-size: 0.9rem;">Live Mission Intelligence</h2>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.75rem; font-family: var(--font-mono);">
                <div style="background: rgba(0,0,0,0.02); padding: 8px; border-radius: 6px;">
                    <div style="color: var(--text-tertiary); margin-bottom: 4px;">CURRENT ENGINEER</div>
                    <div id="intell-engineer" style="font-weight: 600; color: var(--accent);">${intell.currentEngineer || 'Waiting...'}</div>
                </div>
                <div style="background: rgba(0,0,0,0.02); padding: 8px; border-radius: 6px;">
                    <div style="color: var(--text-tertiary); margin-bottom: 4px;">CURRENT FILE</div>
                    <div id="intell-file" style="font-weight: 600;">${intell.currentFile || 'N/A'}</div>
                </div>
                <div style="background: rgba(0,0,0,0.02); padding: 8px; border-radius: 6px; grid-column: span 2;">
                    <div style="color: var(--text-tertiary); margin-bottom: 4px;">CURRENT TASK</div>
                    <div id="intell-task" style="font-weight: 600; color: #10b981;">${intell.currentTask || 'N/A'}</div>
                </div>
                <div style="background: rgba(0,0,0,0.02); padding: 8px; border-radius: 6px;">
                    <div style="color: var(--text-tertiary); margin-bottom: 4px;">REMAINING ARTIFACTS</div>
                    <div id="intell-artifacts" style="font-weight: 600;">${intell.remainingArtifacts}</div>
                </div>
                <div style="background: rgba(0,0,0,0.02); padding: 8px; border-radius: 6px;">
                    <div style="color: var(--text-tertiary); margin-bottom: 4px;">BUILD PROGRESS</div>
                    <div id="intell-build" style="font-weight: 600;">${intell.buildProgress}%</div>
                </div>
                <div style="background: rgba(0,0,0,0.02); padding: 8px; border-radius: 6px;">
                    <div style="color: var(--text-tertiary); margin-bottom: 4px;">VALIDATION</div>
                    <div id="intell-val" style="font-weight: 600;">${intell.validationStatus}</div>
                </div>
                <div style="background: rgba(0,0,0,0.02); padding: 8px; border-radius: 6px;">
                    <div style="color: var(--text-tertiary); margin-bottom: 4px;">CONFIDENCE</div>
                    <div id="intell-conf" style="font-weight: 600;">${intell.confidenceScore}%</div>
                </div>
            </div>
        </div>
        
        <!-- Project Explorer -->
        <div class="glass-panel no-hover" style="flex: 1; display: flex; flex-direction: column;">
            <div class="stage-title-row" style="margin-bottom: 10px;">
                <h2 class="stage-heading" style="font-size: 0.9rem;">Project Explorer</h2>
            </div>
            <div id="os-explorer-body" style="flex: 1; overflow-y: auto; max-height: 200px; font-family: var(--font-mono);">
                ${explorer.files.length > 0 ? explorer.files.map(f => `
                    <div style="padding: 4px 8px; font-size: 0.75rem; border-bottom: 1px solid var(--border-subtle); display: flex; align-items: center; gap: 6px;">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                        ${f}
                    </div>
                `).join('') : '<div style="padding: 8px; color: var(--text-tertiary); font-size: 0.8rem; font-style: italic;">Workspace empty</div>'}
            </div>
        </div>

      </div>

    </div>
  `;

  // Start animated fills
  setTimeout(() => {
    const heroFill = containerEl.querySelector('.hero-progress-fill');
    if (heroFill) animateProgressBar(heroFill, progressVal);

    displayObjectives.forEach(obj => {
      const tile = containerEl.querySelector(`[data-project-id="${obj.id}"]`);
      if (tile) {
        const fill = tile.querySelector('.progress-bar-fill');
        if (fill) animateProgressBar(fill, obj.progressPercentage || 0);
      }
    });

    const termBody = containerEl.querySelector('#os-terminal-body');
    if (termBody) termBody.scrollTop = termBody.scrollHeight;
  }, 50);

  // Bind click events for full-screen task view
  const tiles = containerEl.querySelectorAll('.task-tile-card');
  tiles.forEach(tile => {
    tile.style.cursor = 'pointer';
    tile.title = 'Click to open full-screen Task Board';
    tile.addEventListener('click', () => {
      // Assuming store.switchTab or similar navigation exists in app.js
      // We can dispatch a custom event or update active tab
      const navBtn = document.querySelector('[data-tab="tasks"]');
      if (navBtn) navBtn.click();
    });
  });
}
