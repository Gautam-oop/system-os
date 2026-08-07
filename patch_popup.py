import sys

# 1. Update Navbar.js
nav_path = r'c:\Users\manan\OneDrive\Desktop\AGENTIC I\system-os\js\components\Navbar.js'
with open(nav_path, 'r', encoding='utf-8') as f:
    nav_content = f.read()

target_nav = """      <!-- Upgraded Sleek Notification Bell -->
      <button class="navbar-icon-btn" id="notif-trigger" title="Workspace Activity Stream" style="position: relative; width: 32px; height: 32px; border-radius: 9px; background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease;">
        <svg id="bell-svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" style="transform-origin: top center; color: #3f3f46;">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
        </svg>
        <span style="position: absolute; top: 6px; right: 6px; width: 7px; height: 7px; background: #6366f1; border-radius: 50%; box-shadow: 0 0 8px rgba(99, 102, 241, 0.8);"></span>
      </button>"""
replacement_nav = """      <!-- Upgraded Sleek Notification Bell -->
      <div style="position: relative;" id="notif-wrapper">
        <button class="navbar-icon-btn" id="notif-trigger" title="Workspace Activity Stream" style="position: relative; width: 32px; height: 32px; border-radius: 9px; background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease;">
          <svg id="bell-svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" style="transform-origin: top center; color: #3f3f46;">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
          </svg>
          <span style="position: absolute; top: 6px; right: 6px; width: 7px; height: 7px; background: #6366f1; border-radius: 50%; box-shadow: 0 0 8px rgba(99, 102, 241, 0.8);"></span>
        </button>
        <!-- Popover -->
        <div id="notif-popover" style="display: none; position: absolute; top: 130%; right: -10px; width: 360px; background: #09090b; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); z-index: 9999; overflow: hidden; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem;">
           <div style="padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; gap: 0.5rem; background: #141419;">
             <svg width="16" height="16" fill="none" stroke="#8b5cf6" stroke-width="2" viewBox="0 0 24 24">
               <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
             </svg>
             <h3 style="margin: 0; font-size: 0.9rem; font-weight: 700; color: #fff;">Activity Feed</h3>
           </div>
           <div id="notif-popover-content" style="max-height: 350px; overflow-y: auto; padding: 0.5rem; display: flex; flex-direction: column; gap: 0.25rem;">
             <!-- logs here -->
           </div>
        </div>
      </div>"""

if target_nav in nav_content:
    nav_content = nav_content.replace(target_nav, replacement_nav)
else:
    print("Warning: target_nav not found in Navbar.js")

nav_content += """

export function updateNotificationPopover() {
  const contentEl = document.getElementById('notif-popover-content');
  if (!contentEl) return;
  const state = store.getState();
  const logs = state.activityLogs || [];
  
  if (logs.length === 0) {
    contentEl.innerHTML = `<div style="color: #64748b; padding: 1rem; text-align: center;">No recent activity.</div>`;
    return;
  }
  
  const escapeHtml = str => String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  contentEl.innerHTML = logs.map(log => {
    let color = '#6366f1';
    if (log.severity === 'SUCCESS') color = '#10b981';
    if (log.severity === 'WARN') color = '#f59e0b';
    return `
      <div style="display: flex; gap: 0.5rem; line-height: 1.4; padding: 0.5rem; border-radius: 6px; background: rgba(255,255,255,0.02);">
        <span style="color: #64748b; flex-shrink: 0;">${log.timestamp || ''}</span>
        <span style="color: #cbd5e1; font-weight: bold; flex-shrink: 0; width: 50px;">[${log.agentName || 'SYS'}]</span>
        <span style="color: ${color};">${escapeHtml(log.message)}</span>
      </div>
    `;
  }).join('');
}
"""

with open(nav_path, 'w', encoding='utf-8') as f:
    f.write(nav_content)

# 2. Update app.js
app_path = r'c:\Users\manan\OneDrive\Desktop\AGENTIC I\system-os\js\app.js'
with open(app_path, 'r', encoding='utf-8') as f:
    app_content = f.read()

app_content = app_content.replace("import { renderNavbar } from './components/Navbar.js';", "import { renderNavbar, updateNotificationPopover } from './components/Navbar.js';")

target_click = """      const notifBtn = e.target.closest('#notif-trigger');
      if (notifBtn) {
        store.notify('openModal', { type: 'activity-feed' });
        return;
      }"""
replacement_click = """      const notifBtn = e.target.closest('#notif-trigger');
      if (notifBtn) {
        const popover = document.getElementById('notif-popover');
        if (popover) {
          if (popover.style.display === 'none' || popover.style.display === '') {
            popover.style.display = 'block';
            updateNotificationPopover();
          } else {
            popover.style.display = 'none';
          }
        }
        e.stopPropagation();
        return;
      }"""
app_content = app_content.replace(target_click, replacement_click)

target_subscribe = """    // Animate the bell wiggling on new log
    const bellSvg = document.getElementById('bell-svg');
    if (bellSvg) {
      bellSvg.classList.add('ringing');
      setTimeout(() => bellSvg.classList.remove('ringing'), 800);
    }
  });"""
replacement_subscribe = """    // Animate the bell wiggling on new log
    const bellSvg = document.getElementById('bell-svg');
    if (bellSvg) {
      bellSvg.classList.add('ringing');
      setTimeout(() => bellSvg.classList.remove('ringing'), 800);
    }
    updateNotificationPopover();
  });"""
app_content = app_content.replace(target_subscribe, replacement_subscribe)

target_escape = """    if (e.key === 'Escape' && store.getActiveModal()) {
      store.closeModal();
    }
  });"""
replacement_escape = """    if (e.key === 'Escape' && store.getActiveModal()) {
      store.closeModal();
    }
    if (e.key === 'Escape') {
      const popover = document.getElementById('notif-popover');
      if (popover && popover.style.display === 'block') popover.style.display = 'none';
    }
  });

  document.addEventListener('click', (e) => {
    const popover = document.getElementById('notif-popover');
    const notifBtn = document.getElementById('notif-trigger');
    if (popover && popover.style.display === 'block') {
      if (!popover.contains(e.target) && (!notifBtn || !notifBtn.contains(e.target))) {
        popover.style.display = 'none';
      }
    }
  });"""
app_content = app_content.replace(target_escape, replacement_escape)

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(app_content)

print("Patch popup applied")
