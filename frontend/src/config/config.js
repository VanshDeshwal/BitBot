export class ConfigService {
    constructor() {
        this.env = this.detectEnvironment();
        this.config = this.loadConfig();
    }

    detectEnvironment() {
        const hostname = window.location.hostname;
        
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'development';
        } else if (hostname.includes('.github.io') || hostname.includes('pages.dev')) {
            return 'production';
        } else {
            return 'staging';
        }
    }

    loadConfig() {
        const baseConfig = {
            app: {
                name: 'BitBot',
                version: '1.0.0',
                description: 'AI Assistant powered by LangChain and LangGraph'
            },
            features: {
                enablePWA: true,
                enableAnalytics: false,
                enableErrorReporting: true,
                enableServiceWorker: true
            },
            ui: {
                theme: 'default',
                animations: true,
                soundEffects: false
            },
            chat: {
                maxMessageLength: 1000,
                historyLimit: 100,
                typingDelay: 1000,
                retryAttempts: 3
            }
        };

        const envConfigs = {
            development: {
                api: {
                    baseUrl: 'http://localhost:8000',
                    timeout: 30000,
                    retryAttempts: 3,
                    demoMode: true
                },
                debug: {
                    enabled: true,
                    logLevel: 'debug',
                    showNetworkLogs: true
                },
                features: {
                    enableAnalytics: false,
                    enableErrorReporting: false
                }
            },
            staging: {
                api: {
                    baseUrl: 'https://staging-api.bitbot.dev',
                    timeout: 30000,
                    retryAttempts: 3,
                    demoMode: false
                },
                debug: {
                    enabled: true,
                    logLevel: 'info',
                    showNetworkLogs: false
                },
                features: {
                    enableAnalytics: true,
                    enableErrorReporting: true
                }
            },
            production: {
                api: {
                    baseUrl: 'https://api.bitbot.dev',
                    timeout: 30000,
                    retryAttempts: 3,
                    demoMode: true // Set to false when backend is ready
                },
                debug: {
                    enabled: false,
                    logLevel: 'error',
                    showNetworkLogs: false
                },
                features: {
                    enableAnalytics: true,
                    enableErrorReporting: true
                }
            }
        };

        return this.mergeDeep(baseConfig, envConfigs[this.env] || {});
    }

    mergeDeep(target, source) {
        const output = { ...target };
        
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                output[key] = this.mergeDeep(target[key] || {}, source[key]);
            } else {
                output[key] = source[key];
            }
        }
        
        return output;
    }

    // Getter methods
    getEnvironment() {
        return this.env;
    }

    getApiBaseUrl() {
        return this.config.api?.baseUrl || '';
    }

    getApiTimeout() {
        return this.config.api?.timeout || 30000;
    }

    isDemoMode() {
        return this.config.api?.demoMode || false;
    }

    isDebugEnabled() {
        return this.config.debug?.enabled || false;
    }

    getLogLevel() {
        return this.config.debug?.logLevel || 'error';
    }

    shouldShowNetworkLogs() {
        return this.config.debug?.showNetworkLogs || false;
    }

    getRetryAttempts() {
        return this.config.api?.retryAttempts || 3;
    }

    getMaxMessageLength() {
        return this.config.chat?.maxMessageLength || 1000;
    }

    getHistoryLimit() {
        return this.config.chat?.historyLimit || 100;
    }

    getTypingDelay() {
        return this.config.chat?.typingDelay || 1000;
    }

    isProd() {
        return this.env === 'production';
    }

    isDev() {
        return this.env === 'development';
    }

    isStaging() {
        return this.env === 'staging';
    }

    // Feature flags
    isFeatureEnabled(feature) {
        return this.config.features?.[feature] || false;
    }

    // Theme and UI
    getTheme() {
        return this.config.ui?.theme || 'default';
    }

    areAnimationsEnabled() {
        return this.config.ui?.animations !== false;
    }

    areSoundEffectsEnabled() {
        return this.config.ui?.soundEffects || false;
    }

    // App info
    getAppName() {
        return this.config.app?.name || 'BitBot';
    }

    getAppVersion() {
        return this.config.app?.version || '1.0.0';
    }

    getAppDescription() {
        return this.config.app?.description || 'AI Assistant';
    }

    // Update config at runtime
    updateConfig(updates) {
        this.config = this.mergeDeep(this.config, updates);
    }

    // Get full config (for debugging)
    getFullConfig() {
        return { ...this.config };
    }
}
