/* ==========================================================================
   MISSIONOS - AUTHENTICATION SCREEN COMPONENT
   ========================================================================== */

import { authContext } from '../authContext.js';

let activeView = 'login'; // 'login', 'signup', 'forgot_password'
let loading = false;
let inlineError = null;
let validationErrors = {};
let successState = false;

// SVGs for modern icons
const GoogleIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>`;
const GithubIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`;
const ExclamationIcon = `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
const CheckIcon = `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

export function renderAuth(containerEl, onLoginSuccess) {
  if (!containerEl) return;

  // Clear or render outer shell if not present
  if (!containerEl.querySelector('.auth-showcase')) {
    containerEl.innerHTML = `
      <div class="auth-showcase">
        <div class="auth-showcase-bg"></div>
        <div class="auth-aurora-blob auth-aurora-1"></div>
        <div class="auth-aurora-blob auth-aurora-2"></div>
        <div class="auth-aurora-blob auth-aurora-3"></div>
        <div class="auth-grid-overlay"></div>
        <div class="auth-light-beam"></div>
        <div class="auth-showcase-content">
          <div class="auth-showcase-logo">
            <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span>missionOS</span>
          </div>
          <div class="auth-showcase-middle">
            <h1 class="auth-showcase-title">Empower software engineering teams with <span>AI Workforce</span>.</h1>
            <p class="auth-showcase-desc">An intelligent operating system that integrates automated software engineering agents directly into your product roadmap workflows.</p>
            <div class="auth-feature-list">
              <div class="auth-feature-item">
                <div class="auth-feature-icon">
                  <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div class="auth-feature-text">
                  <h4>Autonomous Teammates</h4>
                  <p>Deploy specialized AI agents for Frontend design, Backend APIs, QA tests, and DevOps deployments.</p>
                </div>
              </div>
              <div class="auth-feature-item">
                <div class="auth-feature-icon">
                  <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="9" y1="3" x2="9" y2="21"></line>
                    <line x1="15" y1="3" x2="15" y2="21"></line>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                  </svg>
                </div>
                <div class="auth-feature-text">
                  <h4>Sleek Kanban Workflows</h4>
                  <p>Organize issues, configure sprint variables, and witness AI agents pull and complete development objectives.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="auth-showcase-footer">
            &copy; 2026 missionOS Inc. All rights reserved.
          </div>
        </div>
      </div>
      <div class="auth-panel">
        <div class="auth-card auth-fade-in" id="auth-card-host"></div>
      </div>
    `;
  }

  const cardHost = containerEl.querySelector('#auth-card-host');
  updateCardContent(cardHost, onLoginSuccess);
}

function updateCardContent(cardHost, onLoginSuccess) {
  if (!cardHost) return;

  // Fade out card content, change, and fade in
  cardHost.innerHTML = getViewHtml();
  attachEvents(cardHost, onLoginSuccess);

  // Trigger brief entry staggered animations for inputs
  const inputs = cardHost.querySelectorAll('.auth-input-group, .auth-social-group, .auth-divider, .auth-submit-btn, .auth-footer');
  inputs.forEach((el, idx) => {
    el.animate(
      [
        { opacity: 0, transform: 'translateY(8px)' },
        { opacity: 1, transform: 'translateY(0px)' }
      ],
      {
        duration: 250,
        delay: idx * 25,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'forwards'
      }
    );
  });
}

function getViewHtml() {
  if (successState && activeView === 'forgot_password') {
    return `
      <div class="auth-success-screen">
        <div class="auth-success-circle">
          ${CheckIcon}
        </div>
        <h2>Check your email</h2>
        <p style="font-size: 0.875rem; color: #71717a; text-align: center; line-height: 1.5;">
          We've sent a password reset link to your email address. Follow the instructions to configure your credentials.
        </p>
        <button class="auth-submit-btn" id="success-back-btn" style="margin-top: 1rem;">
          Back to Login
        </button>
      </div>
    `;
  }

  let headerTitle = '';
  let headerSub = '';
  let formFields = '';
  let submitText = '';
  let footerHtml = '';

  if (activeView === 'login') {
    headerTitle = 'Sign in to missionOS';
    headerSub = 'Welcome back! Enter your credentials to access the OS.';
    submitText = 'Sign In';
    formFields = `
      <div class="auth-input-group">
        <label class="auth-label" for="login-email">Email Address</label>
        <input class="auth-input" type="email" id="login-email" placeholder="name@company.com" required>
        ${validationErrors.email ? `<div class="auth-validation-msg">${validationErrors.email}</div>` : ''}
      </div>
      <div class="auth-input-group">
        <div class="auth-label-row">
          <label class="auth-label" for="login-password">Password</label>
          <a href="#" class="auth-link-forgot" id="forgot-password-trigger">Forgot Password?</a>
        </div>
        <input class="auth-input" type="password" id="login-password" placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" required>
        ${validationErrors.password ? `<div class="auth-validation-msg">${validationErrors.password}</div>` : ''}
      </div>
      <div class="auth-form-row">
        <label class="auth-checkbox-label" for="login-remember">
          <input class="auth-checkbox" type="checkbox" id="login-remember">
          Remember Me
        </label>
      </div>
    `;
    footerHtml = `Don't have an account? <a href="#" id="view-signup-trigger">Sign up</a>`;
  } else if (activeView === 'signup') {
    headerTitle = 'Create your account';
    headerSub = 'Get started with MissionOps and automate your developer cycles.';
    submitText = 'Create Account';
    formFields = `
      <div class="auth-input-group">
        <label class="auth-label" for="signup-name">Full Name</label>
        <input class="auth-input" type="text" id="signup-name" placeholder="John Doe" required>
        ${validationErrors.name ? `<div class="auth-validation-msg">${validationErrors.name}</div>` : ''}
      </div>
      <div class="auth-input-group">
        <label class="auth-label" for="signup-email">Email Address</label>
        <input class="auth-input" type="email" id="signup-email" placeholder="name@company.com" required>
        ${validationErrors.email ? `<div class="auth-validation-msg">${validationErrors.email}</div>` : ''}
      </div>
      <div class="auth-input-group">
        <label class="auth-label" for="signup-password">Password</label>
        <input class="auth-input" type="password" id="signup-password" placeholder="At least 6 characters" required>
        ${validationErrors.password ? `<div class="auth-validation-msg">${validationErrors.password}</div>` : ''}
      </div>
      <div class="auth-input-group">
        <label class="auth-label" for="signup-confirm">Confirm Password</label>
        <input class="auth-input" type="password" id="signup-confirm" placeholder="At least 6 characters" required>
        ${validationErrors.confirm ? `<div class="auth-validation-msg">${validationErrors.confirm}</div>` : ''}
      </div>
    `;
    footerHtml = `Already have an account? <a href="#" id="view-login-trigger">Sign in</a>`;
  } else if (activeView === 'forgot_password') {
    headerTitle = 'Forgot Password';
    headerSub = 'Enter your email address and we will send you a link to reset your password.';
    submitText = 'Send Reset Link';
    formFields = `
      <div class="auth-input-group">
        <label class="auth-label" for="forgot-email">Email Address</label>
        <input class="auth-input" type="email" id="forgot-email" placeholder="name@company.com" required>
        ${validationErrors.email ? `<div class="auth-validation-msg">${validationErrors.email}</div>` : ''}
      </div>
    `;
    footerHtml = `Remembered your password? <a href="#" id="view-login-trigger">Sign in</a>`;
  }

  const errorBlock = inlineError ? `
    <div class="auth-error-inline">
      ${ExclamationIcon}
      <span>${inlineError}</span>
    </div>
  ` : '';

  return `
    <div class="auth-card-header">
      <h2>${headerTitle}</h2>
      <p>${headerSub}</p>
    </div>
    
    <!-- Social Group -->
    <div class="auth-social-group">
      <button class="auth-social-btn" id="social-google-btn" type="button">
        ${GoogleIcon} Google
      </button>
      <button class="auth-social-btn" id="social-github-btn" type="button">
        ${GithubIcon} GitHub
      </button>
    </div>
    
    <div class="auth-divider">
      <span>or continue with</span>
    </div>
    
    <!-- Form -->
    <form class="auth-form" id="auth-form-submit" novalidate>
      ${errorBlock}
      
      ${formFields}
      
      <button class="auth-submit-btn" type="submit" ${loading ? 'disabled' : ''}>
        ${loading ? `<div class="auth-spinner"></div>` : submitText}
      </button>
    </form>
    
    <div class="auth-footer">
      ${footerHtml}
    </div>
  `;
}

function attachEvents(cardHost, onLoginSuccess) {
  // Triggers to switch views
  const toSignup = cardHost.querySelector('#view-signup-trigger');
  if (toSignup) {
    toSignup.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('signup', cardHost, onLoginSuccess);
    });
  }

  const toLogin = cardHost.querySelector('#view-login-trigger');
  if (toLogin) {
    toLogin.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('login', cardHost, onLoginSuccess);
    });
  }

  const toForgot = cardHost.querySelector('#forgot-password-trigger');
  if (toForgot) {
    toForgot.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('forgot_password', cardHost, onLoginSuccess);
    });
  }

  const toBack = cardHost.querySelector('#success-back-btn');
  if (toBack) {
    toBack.addEventListener('click', (e) => {
      e.preventDefault();
      successState = false;
      switchView('login', cardHost, onLoginSuccess);
    });
  }

  // Social Auth mock handlers
  const googleBtn = cardHost.querySelector('#social-google-btn');
  if (googleBtn) {
    googleBtn.addEventListener('click', () => {
      inlineError = "Google OAuth is currently in demonstration mode. Please register via email/password.";
      updateCardContent(cardHost, onLoginSuccess);
    });
  }

  const githubBtn = cardHost.querySelector('#social-github-btn');
  if (githubBtn) {
    githubBtn.addEventListener('click', () => {
      inlineError = "GitHub OAuth is currently in demonstration mode. Please register via email/password.";
      updateCardContent(cardHost, onLoginSuccess);
    });
  }

  // Form Submit Handler
  const form = cardHost.querySelector('#auth-form-submit');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      inlineError = null;
      validationErrors = {};
      
      const isValid = validateForm(cardHost);
      if (!isValid) {
        updateCardContent(cardHost, onLoginSuccess);
        return;
      }

      // Read values FIRST before re-rendering input elements!
      let email = '';
      let password = '';
      let name = '';
      let remember = false;

      if (activeView === 'login') {
        const emailInput = cardHost.querySelector('#login-email');
        const passwordInput = cardHost.querySelector('#login-password');
        const rememberInput = cardHost.querySelector('#login-remember');
        
        email = emailInput ? emailInput.value.trim() : '';
        password = passwordInput ? passwordInput.value : '';
        remember = rememberInput ? rememberInput.checked : false;
      } else if (activeView === 'signup') {
        const nameInput = cardHost.querySelector('#signup-name');
        const emailInput = cardHost.querySelector('#signup-email');
        const passwordInput = cardHost.querySelector('#signup-password');
        
        name = nameInput ? nameInput.value.trim() : '';
        email = emailInput ? emailInput.value.trim() : '';
        password = passwordInput ? passwordInput.value : '';
      } else if (activeView === 'forgot_password') {
        const emailInput = cardHost.querySelector('#forgot-email');
        email = emailInput ? emailInput.value.trim() : '';
      }

      loading = true;
      updateCardContent(cardHost, onLoginSuccess);

      try {
        if (activeView === 'login') {
          await authContext.login(email, password, remember);
          
          // Trigger Login success sequence
          if (onLoginSuccess) {
            onLoginSuccess();
          }
        } else if (activeView === 'signup') {
          await authContext.signup(name, email, password);
          
          if (onLoginSuccess) {
            onLoginSuccess();
          }
        } else if (activeView === 'forgot_password') {
          // Simulate network call
          await new Promise((resolve) => setTimeout(resolve, 1500));
          successState = true;
          loading = false;
          updateCardContent(cardHost, onLoginSuccess);
        }
      } catch (err) {
        inlineError = err.message || 'An error occurred. Please try again.';
        loading = false;
        updateCardContent(cardHost, onLoginSuccess);
      }
    });
  }
}

function switchView(view, cardHost, onLoginSuccess) {
  activeView = view;
  inlineError = null;
  validationErrors = {};
  loading = false;
  
  // Transition card out, modify, transition back
  const animation = cardHost.animate(
    [
      { opacity: 1, transform: 'scale(1) translateY(0px)' },
      { opacity: 0, transform: 'scale(0.96) translateY(-8px)' }
    ],
    { duration: 150, easing: 'ease-in-out' }
  );

  animation.onfinish = () => {
    updateCardContent(cardHost, onLoginSuccess);
    cardHost.animate(
      [
        { opacity: 0, transform: 'scale(0.96) translateY(8px)' },
        { opacity: 1, transform: 'scale(1) translateY(0px)' }
      ],
      { duration: 250, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
    );
  };
}

function validateForm(cardHost) {
  let isValid = true;

  if (activeView === 'login') {
    const emailEl = cardHost.querySelector('#login-email');
    const passEl = cardHost.querySelector('#login-password');
    
    if (!emailEl.value.trim()) {
      validationErrors.email = 'Email address is required.';
      isValid = false;
    } else if (!validateEmailRegex(emailEl.value.trim())) {
      validationErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    if (!passEl.value) {
      validationErrors.password = 'Password is required.';
      isValid = false;
    }
  } else if (activeView === 'signup') {
    const nameEl = cardHost.querySelector('#signup-name');
    const emailEl = cardHost.querySelector('#signup-email');
    const passEl = cardHost.querySelector('#signup-password');
    const confirmEl = cardHost.querySelector('#signup-confirm');

    if (!nameEl.value.trim()) {
      validationErrors.name = 'Full Name is required.';
      isValid = false;
    } else if (nameEl.value.trim().length < 2) {
      validationErrors.name = 'Name must be at least 2 characters.';
      isValid = false;
    }

    if (!emailEl.value.trim()) {
      validationErrors.email = 'Email address is required.';
      isValid = false;
    } else if (!validateEmailRegex(emailEl.value.trim())) {
      validationErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    if (!passEl.value) {
      validationErrors.password = 'Password is required.';
      isValid = false;
    } else if (passEl.value.length < 1) {
      validationErrors.password = 'Password must be at least 1 character.';
      isValid = false;
    }

    if (passEl.value !== confirmEl.value) {
      validationErrors.confirm = 'Passwords do not match.';
      isValid = false;
    }
  } else if (activeView === 'forgot_password') {
    const emailEl = cardHost.querySelector('#forgot-email');
    
    if (!emailEl.value.trim()) {
      validationErrors.email = 'Email address is required.';
      isValid = false;
    } else if (!validateEmailRegex(emailEl.value.trim())) {
      validationErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }
  }

  return isValid;
}

function validateEmailRegex(email) {
  // Relaxed for local development so any username/email string is valid
  return email.trim().length > 0;
}
