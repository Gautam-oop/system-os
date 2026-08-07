import sys

file_path = r'c:\Users\manan\OneDrive\Desktop\AGENTIC I\system-os\js\store.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add typingAgent
target_state = """      warRoomMessages: [],
      decisions: [],
      pendingApproval: null,"""
replacement_state = """      warRoomMessages: [],
      decisions: [],
      pendingApproval: null,
      typingAgent: null,"""
content = content.replace(target_state, replacement_state)

target_addWarRoomMessage = """  addWarRoomMessage(message) {
    const newMsg = { id: `wrm-${Date.now()}-${Math.random().toString(36).slice(2,6)}`, ...message };
    this.state.warRoomMessages.push(newMsg);
    if (this.state.warRoomMessages.length > 200) { this.state.warRoomMessages.shift(); }
    this.notify('warRoomUpdated', this.state.warRoomMessages);
  }"""
replacement_addWarRoomMessage = """  addWarRoomMessage(message) {
    const newMsg = { id: `wrm-${Date.now()}-${Math.random().toString(36).slice(2,6)}`, ...message };
    this.state.warRoomMessages.push(newMsg);
    if (this.state.warRoomMessages.length > 200) { this.state.warRoomMessages.shift(); }
    this.notify('warRoomUpdated', this.state.warRoomMessages);
  }
  
  setTypingAgent(agentName) {
    if (this.state.typingAgent !== agentName) {
      this.state.typingAgent = agentName;
      this.notify('typingUpdated', agentName);
    }
  }"""
content = content.replace(target_addWarRoomMessage, replacement_addWarRoomMessage)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Patch applied to store.js")
