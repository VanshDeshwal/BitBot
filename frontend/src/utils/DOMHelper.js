export class DOMHelper {
    static createElement(tagName, attributes = {}, children = []) {
        const element = document.createElement(tagName);
        
        // Set attributes
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'textContent') {
                element.textContent = value;
            } else if (key === 'innerHTML') {
                element.innerHTML = value;
            } else if (key.startsWith('data-') || key.startsWith('aria-')) {
                element.setAttribute(key, value);
            } else {
                element[key] = value;
            }
        });
        
        // Add children
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof Node) {
                element.appendChild(child);
            }
        });
        
        return element;
    }

    static query(selector, context = document) {
        return context.querySelector(selector);
    }

    static queryAll(selector, context = document) {
        return Array.from(context.querySelectorAll(selector));
    }

    static addClass(element, className) {
        if (element && className) {
            element.classList.add(...className.split(' '));
        }
    }

    static removeClass(element, className) {
        if (element && className) {
            element.classList.remove(...className.split(' '));
        }
    }

    static toggleClass(element, className) {
        if (element && className) {
            element.classList.toggle(className);
        }
    }

    static hasClass(element, className) {
        return element && element.classList.contains(className);
    }

    static setAttributes(element, attributes) {
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
    }

    static getAttributes(element, attributeNames) {
        const result = {};
        attributeNames.forEach(name => {
            result[name] = element.getAttribute(name);
        });
        return result;
    }

    static show(element) {
        if (element) {
            element.style.display = '';
            element.removeAttribute('aria-hidden');
        }
    }

    static hide(element) {
        if (element) {
            element.style.display = 'none';
            element.setAttribute('aria-hidden', 'true');
        }
    }

    static isVisible(element) {
        return element && element.offsetParent !== null;
    }

    static scrollIntoView(element, options = { behavior: 'smooth' }) {
        if (element) {
            element.scrollIntoView(options);
        }
    }

    static getOffset(element) {
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top + window.pageYOffset,
            left: rect.left + window.pageXOffset,
            width: rect.width,
            height: rect.height
        };
    }

    static onReady(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static sanitizeHtml(html) {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }

    static copyToClipboard(text) {
        return navigator.clipboard ? 
            navigator.clipboard.writeText(text) : 
            this.fallbackCopyToClipboard(text);
    }

    static fallbackCopyToClipboard(text) {
        return new Promise((resolve, reject) => {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
                document.body.removeChild(textArea);
                resolve();
            } catch (err) {
                document.body.removeChild(textArea);
                reject(err);
            }
        });
    }

    static isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    static getScrollPosition() {
        return {
            x: window.pageXOffset || document.documentElement.scrollLeft,
            y: window.pageYOffset || document.documentElement.scrollTop
        };
    }

    static animateCSS(element, animationName, callback) {
        element.classList.add('animated', animationName);
        
        function handleAnimationEnd() {
            element.classList.remove('animated', animationName);
            element.removeEventListener('animationend', handleAnimationEnd);
            if (callback) callback();
        }
        
        element.addEventListener('animationend', handleAnimationEnd);
    }
}
