export class MessageFormatter {
    static formatText(text) {
        // Escape HTML to prevent XSS
        const escaped = this.escapeHtml(text);
        
        // Convert newlines to <br>
        let formatted = escaped.replace(/\n/g, '<br>');
        
        // Format URLs
        formatted = this.formatUrls(formatted);
        
        // Format bold text (**text**)
        formatted = this.formatBold(formatted);
        
        // Format italic text (*text*)
        formatted = this.formatItalic(formatted);
        
        // Format inline code (`code`)
        formatted = this.formatInlineCode(formatted);
        
        // Format lists
        formatted = this.formatLists(formatted);
        
        return formatted;
    }

    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    static formatUrls(text) {
        const urlRegex = /(https?:\/\/[^\s<>"{}|\\^`[\]]+)/gi;
        return text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    }

    static formatBold(text) {
        return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    }

    static formatItalic(text) {
        return text.replace(/(?<!\*)\*(?!\*)([^*]+)\*(?!\*)/g, '<em>$1</em>');
    }

    static formatInlineCode(text) {
        return text.replace(/`([^`]+)`/g, '<code>$1</code>');
    }

    static formatLists(text) {
        // Simple list formatting for • bullet points
        const lines = text.split('<br>');
        let inList = false;
        let result = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (line.match(/^[•\-\*]\s+/)) {
                if (!inList) {
                    result.push('<ul class="message-list">');
                    inList = true;
                }
                const content = line.replace(/^[•\-\*]\s+/, '');
                result.push(`<li>${content}</li>`);
            } else {
                if (inList) {
                    result.push('</ul>');
                    inList = false;
                }
                if (line) {
                    result.push(line);
                }
            }
        }
        
        if (inList) {
            result.push('</ul>');
        }
        
        return result.join('<br>').replace(/<br><ul/g, '<ul').replace(/<\/ul><br>/g, '</ul>');
    }

    static formatTime(date, options = {}) {
        const defaultOptions = {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        };
        
        const formatOptions = { ...defaultOptions, ...options };
        
        // If the date is today, show just time
        if (this.isToday(date)) {
            return date.toLocaleTimeString('en-US', formatOptions);
        }
        
        // If yesterday, show "Yesterday"
        if (this.isYesterday(date)) {
            return 'Yesterday ' + date.toLocaleTimeString('en-US', formatOptions);
        }
        
        // If this week, show day name
        if (this.isThisWeek(date)) {
            return date.toLocaleDateString('en-US', { weekday: 'short' }) + ' ' + 
                   date.toLocaleTimeString('en-US', formatOptions);
        }
        
        // Otherwise show date
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        }) + ' ' + date.toLocaleTimeString('en-US', formatOptions);
    }

    static isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    static isYesterday(date) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return date.toDateString() === yesterday.toDateString();
    }

    static isThisWeek(date) {
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
        
        return date >= startOfWeek && date <= endOfWeek;
    }

    static truncateText(text, maxLength = 100) {
        if (text.length <= maxLength) return text;
        
        return text.substring(0, maxLength - 3) + '...';
    }

    static highlightText(text, searchTerm) {
        if (!searchTerm) return text;
        
        const regex = new RegExp(`(${this.escapeRegExp(searchTerm)})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    static escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    static wordCount(text) {
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    }

    static characterCount(text, includeSpaces = true) {
        return includeSpaces ? text.length : text.replace(/\s/g, '').length;
    }

    static estimateReadingTime(text, wordsPerMinute = 200) {
        const words = this.wordCount(text);
        const minutes = Math.ceil(words / wordsPerMinute);
        return minutes === 1 ? '1 min read' : `${minutes} min read`;
    }

    static formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    static formatNumber(number, options = {}) {
        const defaultOptions = {
            notation: 'compact',
            maximumFractionDigits: 1
        };
        
        return new Intl.NumberFormat('en-US', { ...defaultOptions, ...options }).format(number);
    }

    static pluralize(count, singular, plural = null) {
        if (plural === null) {
            plural = singular + 's';
        }
        return count === 1 ? singular : plural;
    }

    static capitalizeFirst(text) {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }

    static titleCase(text) {
        return text.replace(/\w\S*/g, (txt) => 
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    }

    static stripHtml(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    }

    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static formatPhoneNumber(phone) {
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3];
        }
        return phone;
    }
}
