import sys

file_path = r'c:\Users\manan\OneDrive\Desktop\AGENTIC I\system-os\js\services\SimulationService.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Constructor
target_constructor = """    // Track which log index each agent is at within each phase
    this.agentLogCursors = {};
  }"""
replacement_constructor = """    // Track which log index each agent is at within each phase
    this.agentLogCursors = {};
    
    // Enterprise Features: Approval Gates & Conversational Threads
    this.approvalMilestones = {
      dbChoice: false,
      frameworkChoice: false,
      deployTarget: false
    };
    
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

# 2. Tick Start (Chat queue and human approval check)
target_tick_start = """  // ─── Main Simulation Tick ─────────────────────────────────────────
  tick() {
    this.stepCount += 1;
    const tasks = this.store.state.tasks || [];"""
replacement_tick_start = """  // ─── Main Simulation Tick ─────────────────────────────────────────
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
        
        // Random delay before next message (0 to 1 ticks for fast pacing)
        if (this.chatQueue.length > 0) {
          this.chatDelayCounter = Math.floor(Math.random() * 2); 
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
content = content.replace(target_tick_start, replacement_tick_start)

# 3. Task loop: phase transitions and human gates
target_subtasks = """        // If progress >= 98, mark all complete
        if (task.progress >= 98) {
          task.subtasks.forEach(s => { s.done = true; s.status = 'completed'; });
          task.status = 'completed';
          task.progress = 100;
        }
      }"""
replacement_subtasks = """        // Trigger Phase Thread dynamically as task changes phase
        const threadKey = `${task.id}_${phase}`;
        if (!this.activeThreads.has(threadKey) && this.threadTemplates[phase]) {
          this.activeThreads.add(threadKey);
          
          // Enqueue the thread
          const script = this.threadTemplates[phase];
          script.forEach(msg => {
            this.chatQueue.push({
              role: msg.role,
              name: msg.name,
              content: msg.content.replace('[Task]', task.title)
            });
          });
          
          // Set initial typing indicator if queue was empty
          if (this.chatQueue.length === script.length) {
            this.chatDelayCounter = 0; // immediate start
            this.store.setTypingAgent(this.chatQueue[0].name);
          }
        }

        // If progress >= 98, mark all complete
        if (task.progress >= 98) {
          task.subtasks.forEach(s => { s.done = true; s.status = 'completed'; });
          task.status = 'completed';
          task.progress = 100;
          
          this.store.addWarRoomMessage({
            role: 'Project Manager',
            agentName: 'PM-Alpha',
            content: `Task "${task.title}" has been successfully completed.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
        }
      }

      // Enterprise Features: Trigger Approval Gates based on overall progress
      const overallProg = this.store.state.mission?.overallProgress || 0;
      
      if (overallProg >= 20 && !this.approvalMilestones.dbChoice) {
        this.approvalMilestones.dbChoice = true;
        this.store.addWarRoomMessage({ role: 'Backend Engineer', agentName: 'Titan', content: 'We need to decide on the primary database architecture before I begin the data layer.', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
        this.store.setPendingApproval({
          id: 'dbChoice',
          title: 'Choose Database Architecture',
          description: 'The backend engineers require a decision on the primary database.',
          options: ['PostgreSQL', 'MongoDB']
        });
        return; // Break tick
      }
      
      if (overallProg >= 50 && !this.approvalMilestones.frameworkChoice) {
        this.approvalMilestones.frameworkChoice = true;
        this.store.addWarRoomMessage({ role: 'Backend Engineer', agentName: 'Titan', content: 'Moving to API service layer. Need architectural sign-off on the backend framework.', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
        this.store.setPendingApproval({
          id: 'frameworkChoice',
          title: 'Choose Backend Framework',
          description: 'Select the optimal framework for our microservices architecture.',
          options: ['FastAPI', 'Spring Boot', 'Express.js']
        });
        return; // Break tick
      }
      
      if (overallProg >= 85 && !this.approvalMilestones.deployTarget) {
        this.approvalMilestones.deployTarget = true;
        this.store.addWarRoomMessage({ role: 'DevOps', agentName: 'Vortex', content: 'Staging is green. Awaiting final authorization for production deployment target.', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
        this.store.setPendingApproval({
          id: 'deployTarget',
          title: 'Deploy to Production',
          description: 'Choose the cloud provider for the final production deployment.',
          options: ['Vercel', 'AWS', 'Google Cloud']
        });
        return; // Break tick
      }
"""
content = content.replace(target_subtasks, replacement_subtasks)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Patch applied to SimulationService.js cleanly!")
