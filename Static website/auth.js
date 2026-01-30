// Authentication Form Validation and Handling

(() => {
  'use strict';

  // Utility Functions
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // User Management Functions
  const USERS_STORAGE_KEY = 'gearGuard.registeredUsers';
  const CURRENT_USER_KEY = 'gearGuard.currentUser';

  // Get all registered users
  const getRegisteredUsers = () => {
    try {
      const users = localStorage.getItem(USERS_STORAGE_KEY);
      return users ? JSON.parse(users) : [];
    } catch (e) {
      console.error('Error reading users:', e);
      return [];
    }
  };

  // Save registered users
  const saveRegisteredUsers = (users) => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Error saving users:', e);
    }
  };

  // Check if user exists
  const userExists = (email) => {
    const users = getRegisteredUsers();
    return users.some(user => user.email.toLowerCase() === email.toLowerCase());
  };

  // Register new user
  const registerUser = (userData) => {
    const users = getRegisteredUsers();
    users.push({
      ...userData,
      registeredAt: new Date().toISOString()
    });
    saveRegisteredUsers(users);
  };

  // Authenticate user
  const authenticateUser = (email, password) => {
    const users = getRegisteredUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return { success: false, message: 'No account found with this email. Please sign up first.' };
    }
    
    if (user.password !== password) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }
    
    return { success: true, user: { ...user, password: undefined } };
  };

  // Set current user session
  const setCurrentUser = (userData) => {
    try {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
    } catch (e) {
      console.error('Error setting current user:', e);
    }
  };

  // Validation Rules
  const validators = {
    email: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) return 'Email is required';
      if (!emailRegex.test(value)) return 'Please enter a valid email address';
      return null;
    },
    
    password: (value, minLength = 8) => {
      if (!value) return 'Password is required';
      if (value.length < minLength) return `Password must be at least ${minLength} characters`;
      return null;
    },
    
    name: (value, fieldName = 'Name') => {
      if (!value) return `${fieldName} is required`;
      if (value.length < 8) return `${fieldName} must be at least 8 characters`;
      if (!/^[a-zA-Z\s'-]+$/.test(value)) return `${fieldName} contains invalid characters`;
      return null;
    },
    
    passwordMatch: (password, confirmPassword) => {
      if (!confirmPassword) return 'Please confirm your password';
      if (password !== confirmPassword) return 'Passwords do not match';
      return null;
    },
    
    terms: (checked) => {
      if (!checked) return 'You must agree to the terms and conditions';
      return null;
    }
  };

  // Password Strength Calculator
  const calculatePasswordStrength = (password) => {
    if (!password) return { strength: 0, text: 'Enter a password' };
    
    let strength = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    strength += checks.length ? 20 : 0;
    strength += checks.lowercase ? 20 : 0;
    strength += checks.uppercase ? 20 : 0;
    strength += checks.numbers ? 20 : 0;
    strength += checks.special ? 20 : 0;
    
    if (password.length >= 12) strength += 10;
    if (password.length >= 16) strength += 10;
    
    let text = '';
    let level = '';
    
    if (strength <= 40) {
      text = 'Weak password';
      level = 'weak';
    } else if (strength <= 70) {
      text = 'Medium password';
      level = 'medium';
    } else {
      text = 'Strong password';
      level = 'strong';
    }
    
    return { strength, text, level };
  };

  // Show/Hide Error Messages
  const showError = (inputId, message) => {
    const input = qs(`#${inputId}`);
    const errorElement = qs(`#${inputId}Error`);
    
    if (input) {
      input.classList.add('error');
      input.classList.remove('success');
    }
    
    if (errorElement) {
      errorElement.textContent = message;
    }
  };

  const clearError = (inputId) => {
    const input = qs(`#${inputId}`);
    const errorElement = qs(`#${inputId}Error`);
    
    if (input) {
      input.classList.remove('error');
      input.classList.add('success');
    }
    
    if (errorElement) {
      errorElement.textContent = '';
    }
  };

  // Real-time Validation
  const validateField = (field, validator, ...args) => {
    const error = validator(field.value, ...args);
    if (error) {
      showError(field.id, error);
      return false;
    } else {
      clearError(field.id);
      return true;
    }
  };

  // Password Toggle Functionality
  const setupPasswordToggle = (toggleBtnId, passwordInputId) => {
    const toggleBtn = qs(`#${toggleBtnId}`);
    const passwordInput = qs(`#${passwordInputId}`);
    
    if (!toggleBtn || !passwordInput) return;
    
    toggleBtn.addEventListener('click', () => {
      const type = passwordInput.type === 'password' ? 'text' : 'password';
      passwordInput.type = type;
      
      const eyeIcon = toggleBtn.querySelector('.eye-icon');
      if (eyeIcon) {
        eyeIcon.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
      }
    });
  };

  // Login Form Handler
  const initLoginForm = () => {
    const loginForm = qs('#loginForm');
    if (!loginForm) return;
    
    const emailInput = qs('#email');
    const passwordInput = qs('#password');
    const googleLoginBtn = qs('#googleLogin');
    
    // Real-time validation
    if (emailInput) {
      emailInput.addEventListener('blur', () => {
        validateField(emailInput, validators.email);
      });
      
      emailInput.addEventListener('input', () => {
        if (emailInput.classList.contains('error')) {
          validateField(emailInput, validators.email);
        }
      });
    }
    
    if (passwordInput) {
      passwordInput.addEventListener('blur', () => {
        validateField(passwordInput, validators.password);
      });
      
      passwordInput.addEventListener('input', () => {
        if (passwordInput.classList.contains('error')) {
          validateField(passwordInput, validators.password);
        }
      });
    }
    
    // Password toggle
    setupPasswordToggle('togglePassword', 'password');
    
    // Form submission
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      
      // Validate email
      if (!validateField(emailInput, validators.email)) {
        isValid = false;
      }
      
      // Validate password
      if (!validateField(passwordInput, validators.password)) {
        isValid = false;
      }
      
      if (isValid) {
        const email = emailInput.value;
        const password = passwordInput.value;
        const rememberMe = qs('#rememberMe')?.checked;
        
        // Authenticate user
        const authResult = authenticateUser(email, password);
        
        if (!authResult.success) {
          showError('email', authResult.message);
          if (authResult.message.includes('No account found')) {
            // Add link to signup page
            const emailError = qs('#emailError');
            if (emailError) {
              emailError.innerHTML = authResult.message + ' <a href="signup.html" class="link">Sign up here</a>';
            }
          }
          return;
        }
        
        console.log('Login successful:', authResult.user);
        
        // Store current user session
        setCurrentUser({
          ...authResult.user,
          loggedIn: true,
          rememberMe: rememberMe
        });
        
        // Show success message
        alert('Login successful! Redirecting to dashboard...');
        
        // Redirect to main page
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1000);
      }
    });
    
    // Google login
    if (googleLoginBtn) {
      googleLoginBtn.addEventListener('click', () => {
        alert('Google login would be implemented here with OAuth 2.0');
        console.log('Google login clicked');
      });
    }
  };

  // Signup Form Handler
  const initSignupForm = () => {
    const signupForm = qs('#signupForm');
    if (!signupForm) return;
    
    const firstNameInput = qs('#firstName');
    const lastNameInput = qs('#lastName');
    const emailInput = qs('#signupEmail');
    const passwordInput = qs('#signupPassword');
    const confirmPasswordInput = qs('#confirmPassword');
    const googleSignupBtn = qs('#googleSignup');
    
    // Password strength indicator
    if (passwordInput) {
      const strengthFill = qs('#strengthFill');
      const strengthText = qs('#strengthText');
      
      passwordInput.addEventListener('input', () => {
        const { strength, text, level } = calculatePasswordStrength(passwordInput.value);
        
        if (strengthFill) {
          strengthFill.className = 'strength-fill';
          if (level) strengthFill.classList.add(level);
        }
        
        if (strengthText) {
          strengthText.textContent = text;
        }
        
        // Validate if there was an error
        if (passwordInput.classList.contains('error')) {
          validateField(passwordInput, validators.password, 8);
        }
        
        // Check confirm password match
        if (confirmPasswordInput && confirmPasswordInput.value) {
          validateField(
            confirmPasswordInput,
            (val) => validators.passwordMatch(passwordInput.value, val)
          );
        }
      });
      
      passwordInput.addEventListener('blur', () => {
        validateField(passwordInput, validators.password, 8);
      });
    }
    
    // Real-time validation
    if (firstNameInput) {
      firstNameInput.addEventListener('blur', () => {
        validateField(firstNameInput, validators.name, 'First name');
      });
      
      firstNameInput.addEventListener('input', () => {
        if (firstNameInput.classList.contains('error')) {
          validateField(firstNameInput, validators.name, 'First name');
        }
      });
    }
    
    if (lastNameInput) {
      lastNameInput.addEventListener('blur', () => {
        validateField(lastNameInput, validators.name, 'Last name');
      });
      
      lastNameInput.addEventListener('input', () => {
        if (lastNameInput.classList.contains('error')) {
          validateField(lastNameInput, validators.name, 'Last name');
        }
      });
    }
    
    if (emailInput) {
      emailInput.addEventListener('blur', () => {
        validateField(emailInput, validators.email);
      });
      
      emailInput.addEventListener('input', () => {
        if (emailInput.classList.contains('error')) {
          validateField(emailInput, validators.email);
        }
      });
    }
    
    if (confirmPasswordInput) {
      confirmPasswordInput.addEventListener('blur', () => {
        validateField(
          confirmPasswordInput,
          (val) => validators.passwordMatch(passwordInput?.value, val)
        );
      });
      
      confirmPasswordInput.addEventListener('input', () => {
        if (confirmPasswordInput.classList.contains('error')) {
          validateField(
            confirmPasswordInput,
            (val) => validators.passwordMatch(passwordInput?.value, val)
          );
        }
      });
    }
    
    // Password toggles
    setupPasswordToggle('toggleSignupPassword', 'signupPassword');
    setupPasswordToggle('toggleConfirmPassword', 'confirmPassword');
    
    // Form submission
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      
      // Validate all fields
      if (!validateField(firstNameInput, validators.name, 'First name')) {
        isValid = false;
      }
      
      if (!validateField(lastNameInput, validators.name, 'Last name')) {
        isValid = false;
      }
      
      if (!validateField(emailInput, validators.email)) {
        isValid = false;
      }
      
      if (!validateField(passwordInput, validators.password, 8)) {
        isValid = false;
      }
      
      if (!validateField(
        confirmPasswordInput,
        (val) => validators.passwordMatch(passwordInput.value, val)
      )) {
        isValid = false;
      }
      
      if (isValid) {
        const email = emailInput.value;
        
        // Check if user already exists
        if (userExists(email)) {
          showError('signupEmail', 'An account with this email already exists. Please login instead.');
          const emailError = qs('#signupEmailError');
          if (emailError) {
            emailError.innerHTML = 'An account with this email already exists. <a href="login.html" class="link">Login here</a>';
          }
          return;
        }
        
        // Create new user
        const userData = {
          firstName: firstNameInput.value,
          lastName: lastNameInput.value,
          email: email,
          password: passwordInput.value // In production, this should be hashed
        };
        
        console.log('Signup attempt:', { ...userData, password: '***' });
        
        // Register user
        registerUser(userData);
        
        // Set current user session
        setCurrentUser({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          loggedIn: true
        });
        
        // Show success message
        alert('Account created successfully! Redirecting to dashboard...');
        
        // Redirect to main page
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1000);
      }
    });
    
    // Google signup
    if (googleSignupBtn) {
      googleSignupBtn.addEventListener('click', () => {
        alert('Google signup would be implemented here with OAuth 2.0');
        console.log('Google signup clicked');
      });
    }
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initLoginForm();
      initSignupForm();
    });
  } else {
    initLoginForm();
    initSignupForm();
  }
})();
