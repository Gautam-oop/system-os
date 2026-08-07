import sys

file_path = r'c:\Users\manan\OneDrive\Desktop\AGENTIC I\system-os\js\services\SimulationService.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Chat Queue to Constructor
target_constructor = """    this.approvalMilestones = {
      dbChoice: false,
      frameworkChoice: false,
      deployTarget: false
    };
  }"""
replacement_constructor = """    this.approvalMilestones = {
      dbChoice: false,
      frameworkChoice: false,
      deployTarget: false
    };
    
    // Enterprise Features: Conversational Threads
    this.chatQueue = [];
    this.chatDelayCounter = 0;
    this.activeThreads = new Set();
    
    this.threadTemplates = {
      planning: [
        { role: 'Project Manager', name: 'PM-Alpha', content: "I've reviewed the requirements for [Task]. UI, what's your take on the scope?" },
        { role: 'UI Designer', name: 'Aura', content: "Wireframes are looking good. I'll need Backend to confirm the API schema before I finalize the state." },
        { role: 'Backend Engineer', name: 'Titan', content: "API schema is drafted. Let's sync on the endpoints after the planning phase." }
      ],
      scaffolding: [
        { role: 'DevOps', name: 'Vortex', content: "Setting up the local Docker containers and CI/CD stubs for [Task]..." },
        { role: 'Backend Engineer', name: 'Titan', content: "Thanks Vortex. I'm migrating the DB schemas now." }
      ],
      development: [
        { role: 'UI Designer', name: 'Aura', content: "Component library is updated for [Task]. Integrating the logic now." },
        { role: 'Backend Engineer', name: 'Titan', content: "The new routes are deployed to the internal staging environment." },
        { role: 'QA Engineer', name: 'Spectre', content: "I'll start writing the integration tests based on those routes." }
      ],
      testing: [
        { role: 'QA Engineer', name: 'Spectre', content: "I've started running the Cypress suites on [Task]." },
        { role: 'QA Engineer', name: 'Spectre', content: "Wait, I'm seeing a failure on the auth redirect. Aura, can you check?" },
        { role: 'UI Designer', name: 'Aura', content: "Ah, I missed the router guard condition. Pushing a hotfix now." },
        { role: 'QA Engineer', name: 'Spectre', content: "Fix confirmed. Green build across the board." }
      ],
      deployment: [
        { role: 'DevOps', name: 'Vortex', content: "Deploying [Task] to the production target..." },
        { role: 'Project Manager', name: 'PM-Alpha', content: "Let me know when it's live so I can do a final sanity check before marking complete." }
      ]
    };
  }"""
content = content.replace(target_constructor, replacement_constructor)


# 2. Modify Tick to Process Chat Queue
target_tick = """  // ─── Main Simulation Tick ─────────────────────────────────────────
  tick() {
    if (this.store.state.pendingApproval) return; // Pause for human gate

    this.stepCount += 1;
    const tasks = this.store.state.tasks || [];"""
replacement_tick = """  // ─── Main Simulation Tick ─────────────────────────────────────────
  tick() {
    if (this.store.state.pendingApproval) return; // Pause for human gate
    
    // Process Chat Queue
    if (this.chatQueue.length > 0) {
      if (this.chatDelayCounter <= 0) {
        const nextMsg = this.chatQueue.shift();
        this.store.setTypingAgent(null);
        this.store.addWarRoomMessage({
          role: nextMsg.role,
          agentName: nextMsg.name,
          content: nextMsg.content,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        
        // Random delay before next message (if any)
        if (this.chatQueue.length > 0) {
          this.chatDelayCounter = Math.floor(Math.random() * 2) + 1; // 1-2 ticks delay
          this.store.setTypingAgent(this.chatQueue[0].name); // Set next agent as typing
        }
      } else {
        this.chatDelayCounter--;
      }
    } else {
      this.store.setTypingAgent(null);
    }

    this.stepCount += 1;
    const tasks = this.store.state.tasks || [];"""
content = content.replace(target_tick, replacement_tick)


# 3. Trigger threads on phase entry instead of random chatter
target_random_chatter = """        // Random War Room Chatter
        if (Math.random() > 0.6) {
          const roles = ['Project Manager', 'QA Engineer', 'Research Analyst', 'UI Designer', 'DevOps'];
          const messages = [
            `I'm seeing good progress on [${rTask.id}]. Keep it up.`,
            `Just completed a review of the recent commits for [${rTask.id}]. Looks solid.`,
            `Are there any blockers on [${rTask.id}]? Let me know.`,
            `The metrics on [${rTask.id}] are tracking above our baseline.`
          ];
          this.store.addWarRoomMessage({
            role: roles[Math.floor(Math.random() * roles.length)],
            agentName: 'AI Team',
            content: messages[Math.floor(Math.random() * messages.length)],
            timestamp: timeStr
          });
        }"""
replacement_random_chatter = """        // Trigger Phase Thread if not already triggered
        const threadKey = `${rTask.id}_${phase}`;
        if (!this.activeThreads.has(threadKey) && this.threadTemplates[phase] && this.chatQueue.length === 0) {
          this.activeThreads.add(threadKey);
          
          // Enqueue the thread
          const script = this.threadTemplates[phase];
          script.forEach(msg => {
            this.chatQueue.push({
              role: msg.role,
              name: msg.name,
              content: msg.content.replace('[Task]', rTask.title)
            });
          });
          
          // Set initial typing indicator
          if (this.chatQueue.length > 0) {
            this.chatDelayCounter = 1; // Wait 1 tick before first message
            this.store.setTypingAgent(this.chatQueue[0].name);
          }
        }"""
content = content.replace(target_random_chatter, replacement_random_chatter)


with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Patch applied to SimulationService.js")
