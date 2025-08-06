// BitBot - Minimal Chat Application
class BitBot {
    constructor() {
        this.messages = document.getElementById('messages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.typingIndicator = document.getElementById('typingIndicator');
        
        this.isTyping = false;
        this.messageHistory = [];
        
        this.init();
    }

    init() {
        // Event listeners
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.messageInput.addEventListener('input', () => this.handleInputChange());
        
        // Auto-resize textarea
        this.messageInput.addEventListener('input', () => this.autoResize());
        
        // Focus input on load
        this.messageInput.focus();
    }

    handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.sendMessage();
        }
    }

    handleInputChange() {
        const hasText = this.messageInput.value.trim().length > 0;
        this.sendButton.disabled = !hasText || this.isTyping;
    }

    autoResize() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 100) + 'px';
    }

    async sendMessage() {
        const text = this.messageInput.value.trim();
        if (!text || this.isTyping) return;

        // Clear welcome message if it exists
        const welcomeMsg = this.messages.querySelector('.welcome-message');
        if (welcomeMsg) {
            welcomeMsg.remove();
        }

        // Add user message
        this.addMessage(text, 'user');
        
        // Clear input
        this.messageInput.value = '';
        this.messageInput.style.height = 'auto';
        this.handleInputChange();
        
        // Show typing
        this.showTyping();
        
        // Get bot response
        const response = await this.getBotResponse(text);
        
        // Hide typing and show response
        this.hideTyping();
        this.addMessage(response, 'bot');
        
        // Focus input
        this.messageInput.focus();
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const avatar = sender === 'bot' ? '🤖' : '👤';
        const time = this.formatTime(new Date());
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <div class="message-bubble">${this.formatText(text)}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
        
        this.messages.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Add to history
        this.messageHistory.push({ text, sender, timestamp: new Date() });
    }

    showTyping() {
        this.isTyping = true;
        this.typingIndicator.classList.add('show');
        this.handleInputChange();
    }

    hideTyping() {
        this.isTyping = false;
        this.typingIndicator.classList.remove('show');
        this.handleInputChange();
    }

    async getBotResponse(userMessage) {
        // Simulate API delay
        await this.delay(1000 + Math.random() * 2000);
        
        // Mock intelligent responses
        return this.getMockResponse(userMessage);
    }

    getMockResponse(message) {
        const text = message.toLowerCase();
        
        if (this.matchesAny(text, ['hello', 'hi', 'hey', 'greetings'])) {
            return "Hello! I'm BitBot, your AI assistant powered by LangChain and LangGraph. How can I help you today?";
        }
        
        if (this.matchesAny(text, ['help', 'what can you do', 'capabilities'])) {
            return `I'm here to assist you with:

• Answering questions and providing information
• Data analysis and insights  
• Integration with MLPlayground experiments
• Credit risk modeling assistance
• General problem-solving

What would you like to explore?`;
        }
        
        if (this.matchesAny(text, ['bitbot', 'about', 'who are you'])) {
            return "I'm BitBot, an AI assistant built with modern technologies like LangChain and LangGraph. I'm designed to integrate with MLPlayground and Credit Risk modeling systems, running on Azure with FastAPI for intelligent conversations and data analysis.";
        }
        
        if (this.matchesAny(text, ['tech', 'technology', 'stack', 'langchain'])) {
            return `I'm built using cutting-edge technologies:

🔗 **LangChain** - LLM application framework
📊 **LangGraph** - Stateful multi-agent workflows  
⚡ **FastAPI** - High-performance Python backend
☁️ **Azure** - Cloud hosting and scalability
🧠 **Advanced AI** - Intelligent conversation capabilities

This modern stack enables sophisticated, context-aware assistance!`;
        }
        
        if (this.matchesAny(text, ['ml', 'machine learning', 'mlplayground', 'credit risk'])) {
            return "Great question! I'm designed to integrate with MLPlayground for machine learning experiments and Credit Risk modeling systems. Once my backend is fully connected, I'll help you run experiments, analyze models, and provide insights from risk assessments. This integration is coming soon!";
        }
        
        if (this.matchesAny(text, ['thank', 'thanks', 'appreciate'])) {
            return "You're welcome! I'm happy to help. Feel free to ask me anything else - I'm here to assist! 😊";
        }
        
        // Default responses
        const responses = [
            "That's interesting! I'm currently in demo mode while my LangChain backend is being developed. Once fully operational, I'll provide more sophisticated responses and ML integrations.",
            
            "I understand! As BitBot, I'm designed for intelligent assistance with AI and data science tasks. My full capabilities will be unlocked when the backend integration is complete.",
            
            "Thanks for that! While I'm in demo mode, I'm excited to show you what's possible. The integration with MLPlayground and Credit Risk models will enable powerful analytical capabilities.",
            
            "Fascinating! I'm processing your input, and while my complete AI capabilities are still being developed, I'm built to excel at complex reasoning and ML workflow assistance.",
            
            "Great point! I'm powered by LangChain and LangGraph (in development), designed to handle sophisticated queries and integrate with your ML projects for real-time insights."
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    matchesAny(text, keywords) {
        return keywords.some(keyword => text.includes(keyword));
    }

    formatText(text) {
        // Basic text formatting
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>')
            .replace(/•/g, '•');
    }

    formatTime(date) {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }

    scrollToBottom() {
        setTimeout(() => {
            this.messages.scrollTop = this.messages.scrollHeight;
        }, 100);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.bitBot = new BitBot();
});
