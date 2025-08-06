class ChatBot {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.typingIndicator = document.getElementById('typingIndicator');
        
        this.isTyping = false;
        this.messageHistory = [];
        
        this.init();
    }

    init() {
        // Event listeners
        this.sendButton.addEventListener('click', () => this.handleSendMessage());
        this.messageInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.messageInput.addEventListener('input', () => this.handleInputChange());
        
        // Auto-resize textarea
        this.messageInput.addEventListener('input', () => this.autoResizeTextarea());
        
        // Focus on input when page loads
        this.messageInput.focus();
    }

    handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.handleSendMessage();
        }
    }

    handleInputChange() {
        const hasText = this.messageInput.value.trim().length > 0;
        this.sendButton.disabled = !hasText || this.isTyping;
    }

    autoResizeTextarea() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
    }

    async handleSendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isTyping) return;

        // Add user message
        this.addMessage(message, 'user');
        
        // Clear input
        this.messageInput.value = '';
        this.messageInput.style.height = 'auto';
        this.handleInputChange();
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Get bot response
        const botResponse = await this.getBotResponse(message);
        
        // Hide typing indicator and show bot response
        this.hideTypingIndicator();
        this.addMessage(botResponse, 'bot');
        
        // Focus back to input
        this.messageInput.focus();
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = sender === 'bot' ? '🤖' : '👤';
        const time = this.formatTime(new Date());
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <div class="message-text">${this.escapeHtml(text)}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Add to message history
        this.messageHistory.push({
            text: text,
            sender: sender,
            timestamp: new Date()
        });
    }

    showTypingIndicator() {
        this.isTyping = true;
        this.typingIndicator.style.display = 'flex';
        this.handleInputChange();
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.isTyping = false;
        this.typingIndicator.style.display = 'none';
        this.handleInputChange();
    }

    async getBotResponse(userMessage) {
        // Simulate API call delay
        await this.delay(1000 + Math.random() * 2000);
        
        // TODO: Replace with actual API call to your FastAPI backend
        // const response = await this.callBackendAPI(userMessage);
        // return response;
        
        // Mock responses for now
        return this.getMockResponse(userMessage);
    }

    // Future backend integration method (commented out for now)
    /*
    async callBackendAPI(message) {
        try {
            const response = await fetch('https://your-azure-backend.com/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    conversation_id: this.getConversationId(),
                    // Add any other data your backend expects
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.reply || "I'm sorry, I couldn't process that request.";
        } catch (error) {
            console.error('Error calling backend:', error);
            return "I'm having trouble connecting to my backend right now. Please try again later.";
        }
    }
    */

    getMockResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Mock responses based on keywords
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return "Hello! Great to meet you! I'm BitBot, powered by LangChain and LangGraph. How can I help you today?";
        }
        
        if (message.includes('help') || message.includes('what can you do')) {
            return "I'm BitBot, your AI assistant! I can help with various tasks including:\n\n• Answering questions\n• Providing information\n• Helping with analysis\n• Integration with MLPlayground and Credit Risk models\n\nWhat would you like assistance with?";
        }
        
        if (message.includes('bitbot') || message.includes('about')) {
            return "I'm BitBot, an AI assistant built with LangChain and LangGraph! I'm designed to integrate with MLPlayground and Credit Risk modeling systems. My backend runs on Azure with FastAPI, and I'm here to help you with intelligent conversations and data analysis.";
        }
        
        if (message.includes('mlplayground') || message.includes('credit risk')) {
            return "Great question! I'm designed to integrate with MLPlayground and Credit Risk modeling systems. Once my backend is fully connected, I'll be able to help you with machine learning experiments and credit risk analysis. This integration is coming soon!";
        }
        
        if (message.includes('backend') || message.includes('api') || message.includes('azure')) {
            return "My backend is built with FastAPI and hosted on Azure, using LangChain and LangGraph for intelligent processing. The backend integration is currently in development. For now, I'm running in demo mode with mock responses.";
        }
        
        if (message.includes('thank') || message.includes('thanks')) {
            return "You're welcome! I'm happy to help. Is there anything else you'd like to know or discuss?";
        }
        
        // Default responses
        const defaultResponses = [
            "That's an interesting point! I'm currently in demo mode while my LangChain/LangGraph backend is being developed. Once fully integrated, I'll be able to provide more sophisticated responses and connect with your ML systems.",
            "I understand what you're saying. As BitBot, I'm designed to be your intelligent assistant. My full capabilities with LangChain and LangGraph integration are coming soon!",
            "Thanks for sharing that with me! I'm BitBot, and while I'm currently in demo mode, I'm excited to help you once my backend systems are fully operational.",
            "Interesting! I'm processing your message, though my full AI capabilities are still being developed. The integration with MLPlayground and Credit Risk models will unlock my complete potential.",
            "I appreciate your input! As an AI assistant powered by LangChain and LangGraph (in development), I'm designed to help with complex queries and integrate with your existing ML projects."
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }

    formatTime(date) {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML.replace(/\n/g, '<br>');
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getConversationId() {
        // Generate or retrieve conversation ID for backend
        if (!this.conversationId) {
            this.conversationId = 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }
        return this.conversationId;
    }
}

// Initialize the chatbot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.chatBot = new ChatBot();
});

// Handle page visibility change to focus input when user returns
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.chatBot) {
        window.chatBot.messageInput.focus();
    }
});
