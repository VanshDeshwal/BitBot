import { EventEmitter } from '../utils/EventEmitter.js';
import { DOMHelper } from '../utils/DOMHelper.js';
import { MessageFormatter } from '../utils/MessageFormatter.js';

export class ChatInterface extends EventEmitter {
    constructor({ container, apiService, config }) {
        super();
        
        this.container = container;
        this.apiService = apiService;
        this.config = config;
        
        this.elements = {};
        this.messageHistory = [];
        this.isTyping = false;
        this.conversationId = null;
        
        this.setupEventHandlers();
    }

    async render() {
        this.container.innerHTML = this.getTemplate();
        this.cacheElements();
        this.bindEvents();
        this.initializeChat();
    }

    getTemplate() {
        return `
            <div class="chat-container">
                <!-- Chat Header -->
                <header class="chat-header">
                    <div class="bot-info">
                        <div class="bot-avatar">🤖</div>
                        <div class="bot-details">
                            <h1>BitBot</h1>
                            <span class="bot-status" id="botStatus">Online</span>
                        </div>
                    </div>
                    <div class="header-actions">
                        <button class="icon-button" id="clearChat" title="Clear Chat" aria-label="Clear chat history">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14H6L5 6"></path>
                            </svg>
                        </button>
                    </div>
                </header>

                <!-- Chat Messages Area -->
                <main class="chat-messages" id="chatMessages" role="main" aria-live="polite">
                    <!-- Messages will be inserted here -->
                </main>

                <!-- Typing Indicator -->
                <div class="typing-indicator" id="typingIndicator" style="display: none;" aria-hidden="true">
                    <div class="message-avatar">🤖</div>
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>

                <!-- Chat Input Area -->
                <footer class="chat-input-container">
                    <div class="chat-input-wrapper">
                        <textarea 
                            id="messageInput" 
                            placeholder="Type your message here..." 
                            rows="1"
                            maxlength="1000"
                            aria-label="Message input"
                            autocomplete="off"
                            spellcheck="true"
                        ></textarea>
                        <button 
                            id="sendButton" 
                            class="send-button" 
                            title="Send message"
                            aria-label="Send message"
                            disabled
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 2L11 13"></path>
                                <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
                            </svg>
                        </button>
                    </div>
                    <div class="input-footer">
                        <span class="powered-by">Powered by LangChain & LangGraph</span>
                        <span class="connection-status" id="connectionStatus"></span>
                    </div>
                </footer>
            </div>
        `;
    }

    cacheElements() {
        this.elements = {
            chatMessages: this.container.querySelector('#chatMessages'),
            messageInput: this.container.querySelector('#messageInput'),
            sendButton: this.container.querySelector('#sendButton'),
            typingIndicator: this.container.querySelector('#typingIndicator'),
            botStatus: this.container.querySelector('#botStatus'),
            clearChat: this.container.querySelector('#clearChat'),
            connectionStatus: this.container.querySelector('#connectionStatus')
        };
    }

    bindEvents() {
        // Message sending
        this.elements.sendButton.addEventListener('click', () => this.handleSendMessage());
        this.elements.messageInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.elements.messageInput.addEventListener('input', () => this.handleInputChange());
        
        // Clear chat
        this.elements.clearChat.addEventListener('click', () => this.handleClearChat());
        
        // Auto-resize textarea
        this.elements.messageInput.addEventListener('input', () => this.autoResizeTextarea());
        
        // Focus management
        this.elements.messageInput.addEventListener('focus', () => this.scrollToBottom());
    }

    setupEventHandlers() {
        // API service events
        this.on('api:connected', () => this.updateConnectionStatus('connected'));
        this.on('api:disconnected', () => this.updateConnectionStatus('disconnected'));
        this.on('api:error', (error) => this.handleApiError(error));
    }

    initializeChat() {
        this.addWelcomeMessage();
        this.elements.messageInput.focus();
        this.generateConversationId();
        this.updateConnectionStatus(this.config.isDemoMode() ? 'demo' : 'connecting');
    }

    addWelcomeMessage() {
        const welcomeMessage = "Hello! I'm BitBot, your AI assistant. I'm here to help you with your questions and tasks. How can I assist you today?";
        this.addMessage(welcomeMessage, 'bot', { skipHistory: true });
    }

    async handleSendMessage() {
        const message = this.elements.messageInput.value.trim();
        if (!message || this.isTyping) return;

        try {
            // Add user message
            this.addMessage(message, 'user');
            
            // Clear input
            this.clearInput();
            
            // Show typing indicator
            this.showTypingIndicator();
            
            // Get bot response
            const response = await this.apiService.sendMessage({
                message,
                conversationId: this.conversationId,
                history: this.getRecentHistory()
            });
            
            // Hide typing indicator and show response
            this.hideTypingIndicator();
            this.addMessage(response.reply, 'bot', { messageId: response.messageId });
            
        } catch (error) {
            this.hideTypingIndicator();
            this.handleMessageError(error);
        } finally {
            this.elements.messageInput.focus();
        }
    }

    addMessage(text, sender, options = {}) {
        const messageData = {
            id: options.messageId || this.generateMessageId(),
            text,
            sender,
            timestamp: new Date(),
            ...options
        };

        // Add to history (unless explicitly skipped)
        if (!options.skipHistory) {
            this.messageHistory.push(messageData);
        }

        // Create and append message element
        const messageElement = this.createMessageElement(messageData);
        this.elements.chatMessages.appendChild(messageElement);
        
        this.scrollToBottom();
        this.emit('message:added', messageData);
    }

    createMessageElement({ id, text, sender, timestamp }) {
        const messageDiv = DOMHelper.createElement('div', {
            className: `message ${sender}-message`,
            'data-message-id': id
        });

        const avatar = sender === 'bot' ? '🤖' : '👤';
        const formattedTime = MessageFormatter.formatTime(timestamp);
        const formattedText = MessageFormatter.formatText(text);

        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <div class="message-text">${formattedText}</div>
                <div class="message-time">${formattedTime}</div>
            </div>
        `;

        return messageDiv;
    }

    handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.handleSendMessage();
        }
    }

    handleInputChange() {
        const hasText = this.elements.messageInput.value.trim().length > 0;
        this.elements.sendButton.disabled = !hasText || this.isTyping;
    }

    handleClearChat() {
        if (confirm('Are you sure you want to clear the chat history?')) {
            this.clearChat();
        }
    }

    clearChat() {
        this.elements.chatMessages.innerHTML = '';
        this.messageHistory = [];
        this.addWelcomeMessage();
        this.generateConversationId();
        this.emit('chat:cleared');
    }

    clearInput() {
        this.elements.messageInput.value = '';
        this.elements.messageInput.style.height = 'auto';
        this.handleInputChange();
    }

    autoResizeTextarea() {
        const element = this.elements.messageInput;
        element.style.height = 'auto';
        element.style.height = Math.min(element.scrollHeight, 120) + 'px';
    }

    showTypingIndicator() {
        this.isTyping = true;
        this.elements.typingIndicator.style.display = 'flex';
        this.elements.typingIndicator.setAttribute('aria-hidden', 'false');
        this.handleInputChange();
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.isTyping = false;
        this.elements.typingIndicator.style.display = 'none';
        this.elements.typingIndicator.setAttribute('aria-hidden', 'true');
        this.handleInputChange();
    }

    scrollToBottom() {
        setTimeout(() => {
            this.elements.chatMessages.scrollTop = this.elements.chatMessages.scrollHeight;
        }, 100);
    }

    updateConnectionStatus(status) {
        const statusText = {
            'connected': '🟢 Connected',
            'disconnected': '🔴 Disconnected',
            'connecting': '🟡 Connecting...',
            'demo': '🔵 Demo Mode'
        }[status] || '';

        this.elements.connectionStatus.textContent = statusText;
        this.elements.botStatus.textContent = status === 'connected' ? 'Online' : 'Offline';
    }

    handleApiError(error) {
        console.error('API Error:', error);
        this.addMessage(
            "I'm experiencing some technical difficulties. Please try again in a moment.",
            'bot',
            { isError: true }
        );
    }

    handleMessageError(error) {
        console.error('Message Error:', error);
        this.addMessage(
            "Sorry, I couldn't process your message. Please try again.",
            'bot',
            { isError: true }
        );
    }

    generateConversationId() {
        this.conversationId = 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateMessageId() {
        return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getRecentHistory(limit = 10) {
        return this.messageHistory.slice(-limit).map(msg => ({
            text: msg.text,
            sender: msg.sender,
            timestamp: msg.timestamp
        }));
    }

    // Public methods for external control
    sendMessage(message) {
        this.elements.messageInput.value = message;
        return this.handleSendMessage();
    }

    setTyping(isTyping) {
        if (isTyping) {
            this.showTypingIndicator();
        } else {
            this.hideTypingIndicator();
        }
    }

    destroy() {
        this.removeAllListeners();
        this.container.innerHTML = '';
    }
}
