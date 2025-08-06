// Main application entry point
import { ChatInterface } from './components/ChatInterface.js';
import { ApiService } from './services/ApiService.js';
import { ConfigService } from './config/config.js';

class BitBotApp {
    constructor() {
        this.config = new ConfigService();
        this.apiService = new ApiService(this.config);
        this.chatInterface = null;
        
        this.init();
    }

    async init() {
        try {
            await this.loadApplication();
            this.setupErrorHandling();
            this.setupServiceWorker();
        } catch (error) {
            console.error('Failed to initialize BitBot:', error);
            this.showErrorState();
        }
    }

    async loadApplication() {
        // Initialize chat interface
        this.chatInterface = new ChatInterface({
            container: document.getElementById('app'),
            apiService: this.apiService,
            config: this.config
        });

        await this.chatInterface.render();
    }

    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            // TODO: Send error to monitoring service
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            // TODO: Send error to monitoring service
        });
    }

    setupServiceWorker() {
        // Future PWA capabilities
        if ('serviceWorker' in navigator && this.config.isProd()) {
            navigator.serviceWorker.register('./sw.js')
                .then(registration => console.log('SW registered:', registration))
                .catch(error => console.log('SW registration failed:', error));
        }
    }

    showErrorState() {
        document.getElementById('app').innerHTML = `
            <div class="error-state">
                <h1>BitBot - Initialization Error</h1>
                <p>Sorry, there was an error loading the application. Please refresh the page.</p>
                <button onclick="location.reload()">Refresh Page</button>
            </div>
        `;
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.bitBotApp = new BitBotApp();
});

export { BitBotApp };
