/* ==========================================================================
   MISSIONOS - USER PROFILE, TEAM COLLABORATION & SETTINGS MODAL
   ========================================================================== */

import { authContext } from '../authContext.js?v=29';
import { store } from '../store.js?v=29';

export function showUserProfileModal(initialTab = 'profile') {
  let modalHost = document.getElementById('user-profile-modal-host');
  if (modalHost) modalHost.remove();

  modalHost = document.createElement('div');
  modalHost.id = 'user-profile-modal-host';
  document.body.appendChild(modalHost);

  const currentUser = (typeof authContext.getCurrentUser === 'function' ? authContext.getCurrentUser() : authContext.user) || {
    name: 'Lead Engineer',
    username: 'lead_dev',
    email: 'lead@missionos.ai',
    role: 'Admin / Lead Architect',
    avatar: 'EV'
  };

  // Mock collaborators state
  let collaborators = [
    { id: 1, name: 'Elena Vance', email: 'elena@missionos.ai', role: 'Lead Architect', avatar: 'EV', status: 'Online', badge: 'Admin' },
    { id: 2, name: 'Marcus Sterling', email: 'marcus@missionos.ai', role: 'Senior Frontend Dev', avatar: 'MS', status: 'Online', badge: 'Member' },
    { id: 3, name: 'Sarah Chen', email: 'sarah@missionos.ai', role: 'Backend Specialist', avatar: 'SC', status: 'In Call', badge: 'Member' },
    { id: 4, name: 'David K.', email: 'david@missionos.ai', role: 'QA & Security Lead', avatar: 'DK', status: 'Offline', badge: 'Viewer' }
  ];

  let activeTab = initialTab;

  function render() {
    modalHost.innerHTML = `
      <div class="user-profile-overlay">
        <div class="user-profile-modal">
          
          <!-- Modal Sidebar Navigation -->
          <div class="profile-modal-sidebar">
            <div class="profile-user-summary">
              <div class="profile-avatar-box">
                <span>${currentUser.avatar || 'EV'}</span>
              </div>
              <div class="profile-user-info">
                <div class="profile-name-text">${currentUser.name}</div>
                <div class="profile-email-text">${currentUser.email}</div>
              </div>
            </div>

            <nav class="profile-nav-list">
              <button class="profile-nav-btn ${activeTab === 'profile' ? 'active' : ''}" data-ptab="profile">
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <span>Account & Profile</span>
              </button>
              
              <button class="profile-nav-btn ${activeTab === 'team' ? 'active' : ''}" data-ptab="team">
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                <span>Team Collaboration</span>
              </button>

              <button class="profile-nav-btn ${activeTab === 'settings' ? 'active' : ''}" data-ptab="settings">
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                <span>Website & OS Settings</span>
              </button>
            </nav>

            <button class="profile-close-sidebar-btn" id="pm-close">
              Close Settings
            </button>
          </div>

          <!-- Tab Content Area -->
          <div class="profile-modal-body">
            
            ${activeTab === 'profile' ? renderProfileTab(currentUser) : ''}
            ${activeTab === 'team' ? renderTeamTab(collaborators) : ''}
            ${activeTab === 'settings' ? renderSettingsTab() : ''}

          </div>

        </div>
      </div>
    `;

    // Tab Navigation Event Listeners
    modalHost.querySelectorAll('[data-ptab]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        activeTab = btn.getAttribute('data-ptab');
        render();
      });
    });

    const closeBtn = modalHost.querySelector('#pm-close');
    if (closeBtn) closeBtn.addEventListener('click', () => modalHost.remove());

    // Tab specific event handlers
    if (activeTab === 'profile') bindProfileEvents();
    if (activeTab === 'team') bindTeamEvents();
    if (activeTab === 'settings') bindSettingsEvents();
  }

  function renderProfileTab(user) {
    return `
      <div class="ptab-container">
        <div class="ptab-header">
          <h2>Account & Identity</h2>
          <p>Manage your personal profile details and workspace credentials.</p>
        </div>

        <form id="profile-form" class="ptab-form">
          <div class="form-row-2">
            <div class="form-group">
              <label>Full Display Name</label>
              <input type="text" id="prof-name" value="${user.name || 'Lead Engineer'}" class="ptab-input" required>
            </div>
            <div class="form-group">
              <label>Username</label>
              <input type="text" id="prof-username" value="${user.username || 'lead_dev'}" class="ptab-input" required>
            </div>
          </div>

          <div class="form-group">
            <label>Work Email Address</label>
            <input type="email" id="prof-email" value="${user.email || 'lead@missionos.ai'}" class="ptab-input" required>
          </div>

          <div class="form-group">
            <label>Workspace Role Title</label>
            <input type="text" id="prof-role" value="${user.role || 'Admin / Lead Architect'}" class="ptab-input">
          </div>

          <div class="ptab-divider"></div>

          <div class="form-group">
            <label>Change Security Password</label>
            <input type="password" id="prof-pass" placeholder="Enter new password to change..." class="ptab-input">
          </div>

          <div class="ptab-actions">
            <button type="submit" class="btn-primary-ptab">Save Changes ✨</button>
          </div>
        </form>
      </div>
    `;
  }

  function renderTeamTab(members) {
    return `
      <div class="ptab-container">
        <div class="ptab-header">
          <h2>Team Collaboration</h2>
          <p>Invite teammates, manage workspace access permissions, and collaborate like GitHub.</p>
        </div>

        <!-- Invite Teammate Card -->
        <div class="collab-invite-box">
          <h3>Invite New Teammate</h3>
          <div class="invite-inputs">
            <input type="email" id="invite-email" placeholder="teammate@company.com" class="ptab-input">
            <select id="invite-role" class="ptab-select">
              <option value="Admin">Admin</option>
              <option value="Lead">Lead Developer</option>
              <option value="Member" selected>Developer</option>
              <option value="Viewer">Viewer</option>
            </select>
            <button id="invite-send-btn" class="btn-primary-ptab">Send Invite</button>
          </div>
          <div class="invite-share-link">
            <span>Or share workspace link: <code>https://missionos.ai/join/ws-8910-alpha</code></span>
            <button id="copy-link-btn" class="btn-sm-sec">Copy Link</button>
          </div>
        </div>

        <div class="ptab-divider"></div>

        <!-- Active Collaborators List -->
        <div class="collaborators-section">
          <h3>Active Collaborators (${members.length})</h3>
          <div class="collaborators-list">
            ${members.map(m => `
              <div class="collaborator-item">
                <div class="collab-avatar">${m.avatar}</div>
                <div class="collab-info">
                  <div class="collab-name">${m.name} <span class="badge-role">${m.badge}</span></div>
                  <div class="collab-email">${m.email} • <span class="collab-status">${m.status}</span></div>
                </div>
                <div class="collab-actions">
                  <select class="ptab-select-sm" data-collab-id="${m.id}">
                    <option value="Admin" ${m.badge === 'Admin' ? 'selected' : ''}>Admin</option>
                    <option value="Member" ${m.badge === 'Member' ? 'selected' : ''}>Developer</option>
                    <option value="Viewer" ${m.badge === 'Viewer' ? 'selected' : ''}>Viewer</option>
                  </select>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;
  }

  function renderSettingsTab() {
    return `
      <div class="ptab-container">
        <div class="ptab-header">
          <h2>Website & OS Preferences</h2>
          <p>Customize system aesthetics, AI swarm execution parameters, and interface behavior.</p>
        </div>

        <div class="settings-group-list">
          <!-- Theme Preference -->
          <div class="settings-item">
            <div class="setting-text">
              <div class="setting-title">Interface Design Theme</div>
              <div class="setting-desc">Select visual aesthetic style for missionOS.</div>
            </div>
            <select id="setting-theme" class="ptab-select">
              <option value="light" selected>Liquid Glass (Light)</option>
              <option value="dark">Aurora Dark</option>
              <option value="system">Follow System</option>
            </select>
          </div>

          <!-- AI Swarm Execution Speed -->
          <div class="settings-item">
            <div class="setting-text">
              <div class="setting-title">AI Swarm Velocity</div>
              <div class="setting-desc">Adjust simulation cycle speed for autonomous agents.</div>
            </div>
            <select id="setting-swarm-speed" class="ptab-select">
              <option value="max" selected>Max Speed (Turbo)</option>
              <option value="balanced">Balanced (Real-time)</option>
              <option value="eco">Eco Mode (Lower CPU)</option>
            </select>
          </div>

          <!-- Sound FX Toggle -->
          <div class="settings-item">
            <div class="setting-text">
              <div class="setting-title">Audio & Sound FX</div>
              <div class="setting-desc">Play subtle click feedback sounds on dock navigation.</div>
            </div>
            <input type="checkbox" id="setting-sound" class="ptab-checkbox" checked>
          </div>

          <!-- Notifications Stream -->
          <div class="settings-item">
            <div class="setting-text">
              <div class="setting-title">Real-time Activity Toasts</div>
              <div class="setting-desc">Show notification popups when agents complete Kanban tickets.</div>
            </div>
            <input type="checkbox" id="setting-toasts" class="ptab-checkbox" checked>
          </div>

        </div>

        <div class="ptab-actions" style="margin-top: 1.5rem;">
          <button id="save-settings-btn" class="btn-primary-ptab">Save Preferences</button>
        </div>
      </div>
    `;
  }

  function bindProfileEvents() {
    const form = modalHost.querySelector('#profile-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const updatedUser = {
          ...currentUser,
          name: modalHost.querySelector('#prof-name').value,
          username: modalHost.querySelector('#prof-username').value,
          email: modalHost.querySelector('#prof-email').value,
          role: modalHost.querySelector('#prof-role').value,
          avatar: modalHost.querySelector('#prof-name').value.substring(0, 2).toUpperCase()
        };

        localStorage.setItem('mo_user_data', JSON.stringify(updatedUser));
        if (authContext.user) authContext.user = updatedUser;

        store.notify('toast', { type: 'success', text: 'Profile updated successfully!' });
        modalHost.remove();
        
        // Re-render navbar to update profile initials
        const navbarEl = document.getElementById('navbar-host');
        if (navbarEl) {
          const profileInitials = navbarEl.querySelector('.avatar-img');
          if (profileInitials) profileInitials.textContent = updatedUser.avatar;
        }
      });
    }
  }

  function bindTeamEvents() {
    const sendBtn = modalHost.querySelector('#invite-send-btn');
    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        const emailInput = modalHost.querySelector('#invite-email');
        const roleSelect = modalHost.querySelector('#invite-role');

        if (emailInput && emailInput.value) {
          const newMember = {
            id: collaborators.length + 1,
            name: emailInput.value.split('@')[0],
            email: emailInput.value,
            role: 'Developer',
            avatar: emailInput.value.substring(0, 2).toUpperCase(),
            status: 'Invited',
            badge: roleSelect ? roleSelect.value : 'Member'
          };
          collaborators.push(newMember);
          store.notify('toast', { type: 'success', text: `Invitation sent to ${emailInput.value}!` });
          render();
        } else {
          store.notify('toast', { type: 'warning', text: 'Please enter a valid email address.' });
        }
      });
    }

    const copyBtn = modalHost.querySelector('#copy-link-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText('https://missionos.ai/join/ws-8910-alpha');
        store.notify('toast', { type: 'info', text: 'Workspace invite link copied to clipboard!' });
      });
    }
  }

  function bindSettingsEvents() {
    const saveBtn = modalHost.querySelector('#save-settings-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        store.notify('toast', { type: 'success', text: 'System preferences saved!' });
        modalHost.remove();
      });
    }
  }

  render();
}
