import sys

# Patch WarRoom.js
warroom_path = r'c:\Users\manan\OneDrive\Desktop\AGENTIC I\system-os\js\components\WarRoom.js'
with open(warroom_path, 'r', encoding='utf-8') as f:
    wr_content = f.read()

target_typing = """      <!-- Typing Indicator -->
      <div id="war-room-typing" style="padding: 0.5rem 1.5rem; font-size: 0.75rem; color: var(--text-tertiary); font-style: italic; display: flex; align-items: center; gap: 0.5rem; height: 32px; border-top: 1px solid var(--border-subtle); background: var(--bg-primary);">
         <!-- Handled by dynamic updates -->
      </div>"""
replacement_typing = """      <!-- Typing Indicator -->
      <div id="war-room-typing" style="padding: 0.5rem 1.5rem; font-size: 0.75rem; color: var(--text-tertiary); font-style: italic; display: flex; align-items: center; gap: 0.5rem; height: 32px; border-top: 1px solid var(--border-subtle); background: var(--bg-primary);">
         ${state.typingAgent ? `<span style="animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;"><strong>${state.typingAgent}</strong> is typing...</span>` : ''}
      </div>"""
wr_content = wr_content.replace(target_typing, replacement_typing)

with open(warroom_path, 'w', encoding='utf-8') as f:
    f.write(wr_content)
    
# Patch app.js
app_path = r'c:\Users\manan\OneDrive\Desktop\AGENTIC I\system-os\js\app.js'
with open(app_path, 'r', encoding='utf-8') as f:
    app_content = f.read()
    
target_app_subs = """  // Enterprise Features Subscriptions
  store.subscribe('warRoomUpdated', () => {
    const tab = store.getActiveTab();
    if (tab === 'warroom' && views.warroom) renderWarRoom(views.warroom);
  });"""
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
  });"""
app_content = app_content.replace(target_app_subs, replacement_app_subs)

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(app_content)

print("Patched app.js and WarRoom.js")
