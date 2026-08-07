import sys

app_path = r'c:\Users\manan\OneDrive\Desktop\AGENTIC I\system-os\js\app.js'
with open(app_path, 'r', encoding='utf-8') as f:
    app_content = f.read()
    
target_app_subs = """  // ─── DOM EVENT LISTENERS ─────────────────────────────────────────"""
replacement_app_subs = """  // Enterprise Features Subscriptions
  store.subscribe('warRoomUpdated', () => {
    const tab = store.getActiveTab();
    if (tab === 'warroom' && views.warroom) renderWarRoom(views.warroom);
  });
  
  store.subscribe('typingUpdated', () => {
    const tab = store.getActiveTab();
    if (tab === 'warroom' && views.warroom) {
      const typingEl = document.getElementById('war-room-typing');
      const agent = store.getState().typingAgent;
      if (typingEl) {
        typingEl.innerHTML = agent ? `<span style="animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;"><strong>${agent}</strong> is typing...</span>` : '';
      }
    }
  });

  store.subscribe('decisionsUpdated', () => {
    const tab = store.getActiveTab();
    if (tab === 'decisionlog' && views.decisionlog) renderDecisionLog(views.decisionlog);
  });

  const approvalModalHost = document.getElementById('approval-modal-host');
  store.subscribe('approvalRequested', () => {
    if (approvalModalHost) {
      renderApprovalModal(approvalModalHost);
    }
  });

  // ─── DOM EVENT LISTENERS ─────────────────────────────────────────"""
app_content = app_content.replace(target_app_subs, replacement_app_subs)

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(app_content)

print("Patched app.js to fix missing subscriptions")
