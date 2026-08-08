import { store } from '../store.js';
import { renderIncidentChecklist } from './IncidentChecklist.js';

let isScrolledToBottom = true;

export function renderWarRoom(containerEl) {
  const state = store.getState();
  const messages = state.warRoomMessages || [];

  containerEl.innerHTML = `
    <div class="section-header animate-fade-in" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem;">
      <div class="section-title-group">
        <div class="section-icon" style="background: rgba(16, 185, 129, 0.1); color: #10b981;">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        </div>
        <div>
          <h2 class="section-title">AI War Room & Incident Response</h2>
          <p class="section-subtitle">Live collaboration channel for autonomous agents and active incident checklist</p>
        </div>
      </div>
      <div style="display: flex; gap: 0.5rem; align-items: center;">
        <span class="status-dot active"></span>
        <span style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 500;">Live Feed Active</span>
      </div>
    </div>

    <!-- Mounted Incident Action Checklist for Active Incident -->
    <div id="warroom-checklist-host" style="margin-top: 1rem; margin-bottom: 1.5rem;"></div>

    <div class="war-room-container" style="display: flex; flex-direction: column; height: calc(100vh - 200px); background: var(--bg-secondary); border-radius: 12px; border: 1px solid var(--border-subtle); margin-top: 1rem; overflow: hidden;">
      <div style="padding: 0.75rem 1.25rem; background: var(--bg-primary); border-bottom: 1px solid var(--border-subtle); font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); display: flex; align-items: center; justify-content: space-between;">
        <span>💬 AI AGENT STREAM</span>
        <span style="font-size: 0.7rem; font-weight: 400; color: var(--text-tertiary);">${messages.length} MESSAGES LOGGED</span>
      </div>
      
      <!-- Messages Area -->
      <div id="war-room-messages" style="flex: 1; overflow-y: auto; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.2rem; scroll-behavior: smooth;">
        ${messages.length === 0 ? '<div style="text-align: center; color: var(--text-tertiary); margin-top: 2rem;">No messages yet. Agents are initializing...</div>' : ''}
        ${messages.map(msg => renderMessage(msg)).join('')}
      </div>

      <!-- Typing Indicator -->
      <div id="war-room-typing" style="padding: 0.5rem 1.5rem; font-size: 0.75rem; color: var(--text-tertiary); font-style: italic; display: flex; align-items: center; gap: 0.5rem; height: 32px; border-top: 1px solid var(--border-subtle); background: var(--bg-primary);">
         ${state.typingAgent ? `<span style="animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;"><strong>${state.typingAgent}</strong> is typing...</span>` : ''}
      </div>
    </div>
  `;

  // Mount the interactive Incident Checklist inside the AI War Room screen
  const checklistHost = containerEl.querySelector('#warroom-checklist-host');
  if (checklistHost) {
    renderIncidentChecklist(checklistHost, 'incident_active_001');
  }

  // Handle scroll sticking
  const msgsEl = containerEl.querySelector('#war-room-messages');
  if (msgsEl) {
    if (isScrolledToBottom) {
      msgsEl.scrollTop = msgsEl.scrollHeight;
    }
    msgsEl.addEventListener('scroll', () => {
      isScrolledToBottom = Math.abs((msgsEl.scrollHeight - msgsEl.scrollTop) - msgsEl.clientHeight) < 10;
    });
  }
}

function renderMessage(msg) {
  const avatarInitials = msg.role.substring(0, 2).toUpperCase();
  const roleColor = getRoleColor(msg.role);
  
  return `
    <div class="message-row animate-fade-in" style="display: flex; gap: 1rem; align-items: flex-start;">
      <div class="avatar" style="width: 36px; height: 36px; border-radius: 50%; background: ${roleColor}20; color: ${roleColor}; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem; border: 1px solid ${roleColor}40; flex-shrink: 0;">
        ${avatarInitials}
      </div>
      <div class="message-content" style="flex: 1; background: var(--bg-primary); padding: 1rem; border-radius: 0 12px 12px 12px; border: 1px solid var(--border-subtle); box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
          <strong style="color: var(--text); font-size: 0.85rem;">${msg.agentName}</strong>
          <span style="font-size: 0.7rem; color: var(--text-tertiary); font-family: var(--font-mono);">${msg.timestamp}</span>
        </div>
        <div style="color: var(--text-secondary); font-size: 0.85rem; line-height: 1.5;">
          ${msg.content}
        </div>
      </div>
    </div>
  `;
}

function getRoleColor(role) {
  const map = {
    'CEO': '#eab308',
    'Project Manager': '#6366f1',
    'Research Analyst': '#a855f7',
    'Backend Engineer': '#ef4444',
    'UI Designer': '#ec4899',
    'QA Engineer': '#10b981',
    'DevOps': '#f97316'
  };
  return map[role] || '#64748b';
}
