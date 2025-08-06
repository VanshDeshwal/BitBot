import { EventEmitter } from '../utils/EventEmitter.js';

export class ApiService extends EventEmitter {
    constructor(config) {
        super();
        this.config = config;
        this.baseUrl = config.getApiBaseUrl();
        this.isConnected = false;
        this.requestQueue = [];
        this.retryAttempts = 3;
        this.retryDelay = 1000;
        
        this.init();
    }

    async init() {
        await this.checkConnection();
    }

    async checkConnection() {
        if (this.config.isDemoMode()) {
            this.isConnected = true;
            this.emit('api:connected');
            return true;
        }

        try {
            // TODO: Replace with actual health check endpoint
            // const response = await this.fetch('/health');
            // this.isConnected = response.ok;
            
            // For now, simulate connection check
            await this.delay(500);
            this.isConnected = false; // Will be true when backend is ready
            
            if (this.isConnected) {
                this.emit('api:connected');
            } else {
                this.emit('api:disconnected');
            }
        } catch (error) {
            this.isConnected = false;
            this.emit('api:error', error);
        }

        return this.isConnected;
    }

    async sendMessage({ message, conversationId, history = [] }) {
        if (this.config.isDemoMode()) {
            return this.getMockResponse(message);
        }

        return this.makeRequest('/api/chat', {
            method: 'POST',
            body: {
                message,
                conversation_id: conversationId,
                history,
                timestamp: new Date().toISOString()
            }
        });
    }

    async makeRequest(endpoint, options = {}) {
        const requestId = this.generateRequestId();
        
        try {
            const response = await this.fetchWithRetry(endpoint, {
                method: options.method || 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Request-ID': requestId,
                    ...options.headers
                },
                body: options.body ? JSON.stringify(options.body) : undefined,
                signal: this.createTimeoutSignal(30000) // 30s timeout
            });

            if (!response.ok) {
                throw new ApiError(`HTTP ${response.status}: ${response.statusText}`, response.status);
            }

            return await response.json();
        } catch (error) {
            this.handleRequestError(error, requestId);
            throw error;
        }
    }

    async fetchWithRetry(endpoint, options, attempt = 1) {
        try {
            const url = `${this.baseUrl}${endpoint}`;
            return await fetch(url, options);
        } catch (error) {
            if (attempt < this.retryAttempts && this.isRetryableError(error)) {
                await this.delay(this.retryDelay * attempt);
                return this.fetchWithRetry(endpoint, options, attempt + 1);
            }
            throw error;
        }
    }

    // Mock response system (for demo mode)
    async getMockResponse(userMessage) {
        // Simulate network delay
        await this.delay(1000 + Math.random() * 2000);
        
        const message = userMessage.toLowerCase();
        let reply = this.selectMockResponse(message);
        
        return {
            reply,
            messageId: this.generateMessageId(),
            conversationId: this.generateConversationId(),
            timestamp: new Date().toISOString(),
            model: 'demo-mode',
            usage: {
                prompt_tokens: userMessage.length,
                completion_tokens: reply.length,
                total_tokens: userMessage.length + reply.length
            }
        };
    }

    selectMockResponse(message) {
        // Greeting responses
        if (this.matchesKeywords(message, ['hello', 'hi', 'hey', 'greetings'])) {
            return "Hello! Great to meet you! I'm BitBot, powered by LangChain and LangGraph. How can I help you today?";
        }

        // Help and capabilities
        if (this.matchesKeywords(message, ['help', 'what can you do', 'capabilities', 'features'])) {
            return `I'm BitBot, your AI assistant! I can help with various tasks including:

• Answering questions and providing information
• Data analysis and insights
• Integration with MLPlayground for machine learning experiments
• Credit risk modeling and analysis
• General problem-solving and consultation

What would you like assistance with?`;
        }

        // About BitBot
        if (this.matchesKeywords(message, ['bitbot', 'about', 'who are you', 'what are you'])) {
            return "I'm BitBot, an AI assistant built with LangChain and LangGraph! I'm designed to integrate with MLPlayground and Credit Risk modeling systems. My backend runs on Azure with FastAPI, and I'm here to help you with intelligent conversations, data analysis, and ML workflows.";
        }

        // Technical stack questions
        if (this.matchesKeywords(message, ['langchain', 'langgraph', 'technology', 'tech stack'])) {
            return "I'm built using cutting-edge AI technologies:\n\n🔗 **LangChain**: For building applications with LLMs\n📊 **LangGraph**: For creating stateful, multi-actor applications\n⚡ **FastAPI**: High-performance Python web framework\n☁️ **Azure**: Cloud hosting and scalability\n🤖 **Advanced AI Models**: For intelligent responses\n\nThis stack enables me to provide sophisticated, context-aware assistance!";
        }

        // Integration questions
        if (this.matchesKeywords(message, ['mlplayground', 'credit risk', 'integration', 'ml', 'machine learning'])) {
            return "Excellent question! I'm designed to seamlessly integrate with:\n\n🧪 **MLPlayground**: For machine learning experimentation, model training, and data analysis\n📊 **Credit Risk Models**: For financial risk assessment and modeling\n🔄 **Workflow Integration**: Connecting different ML pipelines\n\nOnce my backend is fully connected, I'll be able to help you run experiments, analyze model performance, and provide insights from your credit risk assessments. This integration is coming soon!";
        }

        // Backend and development
        if (this.matchesKeywords(message, ['backend', 'api', 'azure', 'fastapi', 'development'])) {
            return "My backend architecture includes:\n\n⚡ **FastAPI**: Modern, fast web framework for APIs\n☁️ **Azure**: Cloud hosting with scalability and reliability\n🔗 **LangChain**: LLM application framework\n📊 **LangGraph**: Stateful multi-agent workflows\n🔒 **Security**: Enterprise-grade authentication and authorization\n\nThe backend integration is currently in development. For now, I'm running in demo mode with intelligent mock responses, but soon I'll have full AI capabilities!";
        }

        // Gratitude
        if (this.matchesKeywords(message, ['thank', 'thanks', 'appreciate'])) {
            return "You're very welcome! I'm happy to help. Is there anything else you'd like to know or discuss? I'm here to assist with any questions about AI, machine learning, or technical topics!";
        }

        // Default intelligent responses
        const defaultResponses = [
            "That's an interesting point! I'm currently in demo mode while my LangChain/LangGraph backend is being developed. Once fully integrated, I'll be able to provide more sophisticated responses and connect with your ML systems for advanced analysis.",
            
            "I understand what you're saying. As BitBot, I'm designed to be your intelligent assistant for ML and data science tasks. My full capabilities with LangChain and LangGraph integration are coming soon, including seamless MLPlayground connectivity!",
            
            "Thanks for sharing that with me! I'm BitBot, and while I'm currently in demo mode, I'm excited to help you once my backend systems are fully operational. The integration with credit risk models will unlock powerful analytical capabilities.",
            
            "Interesting perspective! I'm processing your message, and while my full AI capabilities are still being developed, I'm designed to excel at data analysis, ML workflows, and intelligent problem-solving. The LangGraph integration will enable complex multi-step reasoning.",
            
            "I appreciate your input! As an AI assistant powered by LangChain and LangGraph (in development), I'm built to handle complex queries and integrate seamlessly with your existing ML projects. Soon I'll be able to provide real-time insights from your MLPlayground experiments!"
        ];

        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    matchesKeywords(message, keywords) {
        return keywords.some(keyword => message.includes(keyword));
    }

    // Utility methods
    createTimeoutSignal(timeout) {
        const controller = new AbortController();
        setTimeout(() => controller.abort(), timeout);
        return controller.signal;
    }

    isRetryableError(error) {
        return error.name === 'NetworkError' || 
               error.name === 'TimeoutError' ||
               (error.status >= 500 && error.status < 600);
    }

    handleRequestError(error, requestId) {
        console.error(`API Request ${requestId} failed:`, error);
        this.emit('api:error', error);
    }

    generateRequestId() {
        return 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateMessageId() {
        return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateConversationId() {
        return 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Public methods
    getConnectionStatus() {
        return this.isConnected;
    }

    async reconnect() {
        return this.checkConnection();
    }

    setBaseUrl(url) {
        this.baseUrl = url;
        return this.checkConnection();
    }
}

// Custom error class for API errors
export class ApiError extends Error {
    constructor(message, status, response = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.response = response;
    }
}
