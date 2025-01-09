import { AuthService } from '../services/authService.js';
import { ValidationUtil } from '../utils/validationUtil.js';
import { NotificationUtil } from '../utils/notificationUtil.js';

class AuthController {
    constructor() {
        this.authService = new AuthService();
        this.validator = new ValidationUtil();
        this.notifier = new NotificationUtil();
    }

    async handleLogin(event) {
        event.preventDefault();
        try {
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            // Enhanced validation
            const validationErrors = this.validateLoginInput(email, password);
            if (validationErrors.length > 0) {
                this.notifier.showErrors(validationErrors);
                return false;
            }

            const response = await this.authService.login(email, password);
            if (response.success) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('userId', response.userId);
                this.notifier.showSuccess('Login successful!');
                this.toggleForms('player');
            }
        } catch (error) {
            this.notifier.showError('Login failed: ' + error.message);
            console.error('Login error:', error);
        }
        return false;
    }

    validateLoginInput(email, password) {
        const errors = [];
        if (!this.validator.isValidEmail(email)) {
            errors.push('Please enter a valid email address');
        }
        if (!this.validator.isValidPassword(password)) {
            errors.push('Password must be at least 6 characters long');
        }
        return errors;
    }

    // Similar improvements for register and other methods...
}

export const authController = new AuthController();
