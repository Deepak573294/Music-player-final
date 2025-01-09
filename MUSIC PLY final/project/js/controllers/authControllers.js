import { login, register } from '../services/authService.js';
import { ValidationUtil } from '../utils/validationUtil.js';
import { NotificationUtil } from '../utils/notificationUtil.js';

class AuthController {
    constructor() {
        this.validator = new ValidationUtil();
        this.notifier = new NotificationUtil();
    }

    async handleLogin(event) {
        event.preventDefault();
        try {
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            const validationErrors = this.validateLoginInput(email, password);
            if (validationErrors.length > 0) {
                this.notifier.showErrors(validationErrors);
                return false;
            }

            const response = await login(email, password);
            if (response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('userId', response.userId);
                this.notifier.showSuccess('Login successful!');
                this.toggleForms('player');
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            this.notifier.showError('Login failed: ' + error.message);
            console.error('Login error:', error);
        }
        return false;
    }

    async handleRegister(event) {
        event.preventDefault();
        try {
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;

            const validationErrors = this.validateRegisterInput(name, email, password);
            if (validationErrors.length > 0) {
                this.notifier.showErrors(validationErrors);
                return false;
            }

            const response = await register(name, email, password);
            if (response.token) {
                this.notifier.showSuccess('Registration successful! You can now log in.');
                this.toggleForms('login');
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            this.notifier.showError('Registration failed: ' + error.message);
            console.error('Registration error:', error);
        }
        return false;
    }

    toggleForms(formToShow) {
        document.getElementById('loginForm').classList.toggle('d-none', formToShow !== 'login');
        document.getElementById('registerForm').classList.toggle('d-none', formToShow !== 'register');
        document.getElementById('musicPlayer').classList.toggle('d-none', formToShow !== 'player');
    }

    validateLoginInput(email, password) {
        const errors = [];
        if (!this.validator.isValidEmail(email)) {
            errors.push('Please enter a valid email address');
        }
        if (!password.trim()) {
            errors.push('Password is required');
        }
        return errors;
    }

    validateRegisterInput(name, email, password) {
        const errors = this.validateLoginInput(email, password);
        if (!name.trim()) {
            errors.push('Name is required');
        }
        return errors;
    }
}

export const authController = new AuthController();

