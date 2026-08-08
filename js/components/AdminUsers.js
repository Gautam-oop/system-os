/* ==========================================================================
   MISSIONOS - ADMIN USER MANAGEMENT COMPONENT
   ========================================================================== */

import { apiService } from '../apiService.js';

let currentFilters = {
  search: '',
  role: '',
  status: ''
};

let selectedUser = null;

export function renderAdminUsers(containerEl) {
  containerEl.className = 'view-section-container admin-users-view';
  
  // Render main layout skeleton
  containerEl.innerHTML = `
    <div class="view-header">
      <div class="header-title-group">
        <h1 class="view-title">User Directory</h1>
        <p class="view-subtitle">Monitor and manage user accounts and roles in SQLite</p>
      </div>
    </div>
    
    <!-- Stats Banner -->
    <div class="admin-stats-grid" id="admin-stats-container">
      <div class="glass-panel stat-card loading"><div class="spinner"></div></div>
      <div class="glass-panel stat-card loading"><div class="spinner"></div></div>
      <div class="glass-panel stat-card loading"><div class="spinner"></div></div>
      <div class="glass-panel stat-card loading"><div class="spinner"></div></div>
    </div>

    <!-- Filters and Actions Toolbar -->
    <div class="admin-toolbar glass-panel">
      <div class="search-box-wrapper">
        <svg class="search-icon" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" id="user-search-input" class="form-input" placeholder="Search by name or email..." value="${currentFilters.search}">
      </div>
      <div class="filter-group">
        <select id="user-role-filter" class="form-select">
          <option value="">All Roles</option>
          <option value="admin" ${currentFilters.role === 'admin' ? 'selected' : ''}>Admin</option>
          <option value="user" ${currentFilters.role === 'user' ? 'selected' : ''}>User</option>
        </select>
        <select id="user-status-filter" class="form-select">
          <option value="">All Statuses</option>
          <option value="active" ${currentFilters.status === 'active' ? 'selected' : ''}>Active</option>
          <option value="disabled" ${currentFilters.status === 'disabled' ? 'selected' : ''}>Disabled</option>
        </select>
      </div>
    </div>

    <!-- Table and Detail Panel Split Layout -->
    <div class="admin-workspace">
      <div class="table-container glass-panel">
        <table class="admin-users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Last Login</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody id="users-table-body">
            <tr>
              <td colspan="7" class="table-loading"><div class="spinner"></div> Loading users...</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Detail Sidebar Panel -->
      <div class="detail-sidebar glass-panel" id="user-detail-sidebar" style="display: none;">
        <!-- Content will be injected dynamically -->
      </div>
    </div>
  `;

  // Attach search and filter event listeners
  const searchInput = containerEl.querySelector('#user-search-input');
  let searchTimeout = null;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      currentFilters.search = e.target.value.trim();
      loadUsersList(containerEl);
    }, 300);
  });

  const roleFilter = containerEl.querySelector('#user-role-filter');
  roleFilter.addEventListener('change', (e) => {
    currentFilters.role = e.target.value;
    loadUsersList(containerEl);
  });

  const statusFilter = containerEl.querySelector('#user-status-filter');
  statusFilter.addEventListener('change', (e) => {
    currentFilters.status = e.target.value;
    loadUsersList(containerEl);
  });

  // Load initial data
  loadStats(containerEl);
  loadUsersList(containerEl);
}

async function loadStats(containerEl) {
  const statsContainer = containerEl.querySelector('#admin-stats-container');
  try {
    const stats = await apiService.adminFetchStats();
    statsContainer.innerHTML = `
      <div class="glass-panel stat-card">
        <div class="stat-icon-wrapper blue">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">${stats.total_users}</span>
          <span class="stat-label">Total Registered</span>
        </div>
      </div>
      <div class="glass-panel stat-card">
        <div class="stat-icon-wrapper green">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">${stats.active_users}</span>
          <span class="stat-label">Active Users</span>
        </div>
      </div>
      <div class="glass-panel stat-card">
        <div class="stat-icon-wrapper red">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">${stats.inactive_users}</span>
          <span class="stat-label">Disabled Accounts</span>
        </div>
      </div>
      <div class="glass-panel stat-card">
        <div class="stat-icon-wrapper purple">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">${stats.admin_count}</span>
          <span class="stat-label">Administrators</span>
        </div>
      </div>
    `;
  } catch (err) {
    console.error('Failed to load admin stats:', err);
    statsContainer.innerHTML = `<div class="error-banner">Failed to load statistics: ${err.message}</div>`;
  }
}

async function loadUsersList(containerEl) {
  const tbody = containerEl.querySelector('#users-table-body');
  try {
    const users = await apiService.adminFetchUsers(currentFilters);
    if (users.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="table-empty">No users found matching search/filter criteria.</td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = users.map(user => {
      const createdStr = formatDate(user.created_at);
      const lastLoginStr = user.last_login ? formatDate(user.last_login) : 'Never';
      
      const roleBadge = user.role === 'admin' 
        ? '<span class="role-badge admin">Admin</span>' 
        : '<span class="role-badge user">User</span>';
        
      const statusBadge = user.is_active
        ? '<span class="status-badge active"><span class="dot"></span>Active</span>'
        : '<span class="status-badge disabled"><span class="dot"></span>Disabled</span>';

      const actionBtn = user.is_active
        ? `<button class="btn btn-action-disable" data-user-id="${user.id}">Disable</button>`
        : `<button class="btn btn-action-enable" data-user-id="${user.id}">Enable</button>`;

      return `
        <tr class="user-row ${selectedUser && selectedUser.id === user.id ? 'selected' : ''}" data-user-id="${user.id}">
          <td class="user-cell-name">
            <img src="${user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40'}" class="user-avatar" alt="Avatar">
            <span>${escapeHTML(user.name)}</span>
          </td>
          <td>${escapeHTML(user.email)}</td>
          <td>${roleBadge}</td>
          <td>${statusBadge}</td>
          <td class="td-mono">${createdStr}</td>
          <td class="td-mono">${lastLoginStr}</td>
          <td style="text-align: right;" class="action-cell">
            ${actionBtn}
          </td>
        </tr>
      `;
    }).join('');

    // Attach row click listeners for User Details
    tbody.querySelectorAll('.user-row').forEach(row => {
      row.addEventListener('click', (e) => {
        // Prevent opening detail if clicked on action button
        if (e.target.closest('.action-cell') || e.target.tagName === 'BUTTON') return;
        
        const userId = row.getAttribute('data-user-id');
        const user = users.find(u => u.id === userId);
        if (user) {
          selectedUser = user;
          // Mark selected row
          tbody.querySelectorAll('.user-row').forEach(r => r.classList.remove('selected'));
          row.classList.add('selected');
          showUserDetail(containerEl, user);
        }
      });
    });

    // Attach toggle status action button listeners
    tbody.querySelectorAll('.btn-action-disable, .btn-action-enable').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const userId = btn.getAttribute('data-user-id');
        const isDisabling = btn.classList.contains('btn-action-disable');
        btn.disabled = true;
        btn.textContent = 'Updating...';

        try {
          await apiService.adminToggleUserStatus(userId, !isDisabling);
          
          // Show quick Toast
          const toast = document.getElementById('toast-container');
          if (toast) {
            const el = document.createElement('div');
            el.className = `toast ${isDisabling ? 'warning' : 'success'}`;
            el.textContent = `User status successfully updated!`;
            toast.appendChild(el);
            setTimeout(() => el.remove(), 3000);
          }

          // Reload both stats and list
          loadStats(containerEl);
          await loadUsersList(containerEl);

          // If current detail is open for this user, refresh detail panel
          if (selectedUser && selectedUser.id === userId) {
            selectedUser.is_active = !isDisabling;
            showUserDetail(containerEl, selectedUser);
          }
        } catch (err) {
          alert(`Failed to update user status: ${err.message}`);
          btn.disabled = false;
          btn.textContent = isDisabling ? 'Disable' : 'Enable';
        }
      });
    });

  } catch (err) {
    console.error('Failed to load user list:', err);
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="table-error">Error loading user list: ${err.message}</td>
      </tr>
    `;
  }
}

function showUserDetail(containerEl, user) {
  const sidebar = containerEl.querySelector('#user-detail-sidebar');
  sidebar.style.display = 'block';
  sidebar.classList.add('active');

  const createdStr = formatDate(user.created_at);
  const lastLoginStr = user.last_login ? formatDate(user.last_login) : 'Never';

  sidebar.innerHTML = `
    <div class="sidebar-header">
      <h3>User Details</h3>
      <button class="btn-close" id="btn-close-detail">
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <div class="sidebar-body">
      <div class="detail-avatar-section">
        <img src="${user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}" class="detail-avatar" alt="Avatar">
        <h4>${escapeHTML(user.name)}</h4>
        <span class="detail-badge ${user.role}">${user.role === 'admin' ? 'Administrator' : 'Standard User'}</span>
      </div>
      
      <div class="detail-info-list">
        <div class="detail-info-item">
          <label>Email Address</label>
          <span>${escapeHTML(user.email)}</span>
        </div>
        <div class="detail-info-item">
          <label>Database User ID</label>
          <span class="font-mono text-small">${user.id}</span>
        </div>
        <div class="detail-info-item">
          <label>Account Status</label>
          <span class="status-indicator ${user.is_active ? 'active' : 'disabled'}">
            <span class="dot"></span>
            ${user.is_active ? 'Active (Access Granted)' : 'Disabled (Access Revoked)'}
          </span>
        </div>
        <div class="detail-info-item">
          <label>Created Date</label>
          <span class="font-mono">${createdStr}</span>
        </div>
        <div class="detail-info-item">
          <label>Last Login Session</label>
          <span class="font-mono">${lastLoginStr}</span>
        </div>
      </div>
    </div>
  `;

  sidebar.querySelector('#btn-close-detail').addEventListener('click', () => {
    sidebar.style.display = 'none';
    sidebar.classList.remove('active');
    selectedUser = null;
    containerEl.querySelectorAll('.user-row').forEach(row => row.classList.remove('selected'));
  });
}

function formatDate(isoString) {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (e) {
    return isoString;
  }
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
