# Development Guide

## Project Architecture

BitBot follows a modular, scalable architecture designed for enterprise-level applications:

### Frontend Architecture

```
src/
├── app.js                 # Application entry point and initialization
├── components/            # Reusable UI components
│   └── ChatInterface.js   # Main chat component with full lifecycle management
├── services/              # External API and business logic
│   └── ApiService.js      # Backend communication with retry/error handling
├── utils/                 # Shared utility functions
│   ├── EventEmitter.js    # Custom event system for loose coupling
│   ├── DOMHelper.js       # DOM manipulation utilities
│   └── MessageFormatter.js # Text formatting and sanitization
├── config/                # Configuration management
│   └── config.js          # Environment-aware configuration
└── assets/                # Static assets
    └── css/
        └── main.css       # Comprehensive styling with CSS variables
```

### Design Principles

1. **Separation of Concerns**: Each module has a single responsibility
2. **Event-Driven Architecture**: Components communicate through events
3. **Configuration-Based**: Environment-specific behavior through config
4. **Modular CSS**: Organized with CSS variables and component-specific styles
5. **Accessibility First**: ARIA labels, keyboard navigation, semantic HTML

## Development Workflow

### Local Development

1. **Clone and setup:**
   ```bash
   git clone https://github.com/VanshDeshwal/BitBot.git
   cd BitBot/frontend
   ```

2. **Start development server:**
   ```bash
   # Option 1: Python
   python -m http.server 8080
   
   # Option 2: Node.js (if available)
   npx serve .
   
   # Option 3: VS Code Live Server extension
   ```

3. **Access application:**
   - Open `http://localhost:8080`
   - The app will automatically detect development environment

### Code Organization

#### Adding New Components

1. Create new file in `src/components/`
2. Export as ES6 module
3. Import in `app.js` or parent component
4. Follow the component pattern:

```javascript
import { EventEmitter } from '../utils/EventEmitter.js';

export class NewComponent extends EventEmitter {
    constructor(options) {
        super();
        this.options = options;
        this.init();
    }

    init() {
        this.render();
        this.bindEvents();
    }

    render() {
        // DOM creation logic
    }

    bindEvents() {
        // Event listeners
    }

    destroy() {
        this.removeAllListeners();
        // Cleanup logic
    }
}
```

#### Adding New Services

1. Create new file in `src/services/`
2. Extend EventEmitter for async communication
3. Implement error handling and retry logic
4. Follow the service pattern:

```javascript
import { EventEmitter } from '../utils/EventEmitter.js';

export class NewService extends EventEmitter {
    constructor(config) {
        super();
        this.config = config;
        this.init();
    }

    async init() {
        // Service initialization
    }

    async performAction(data) {
        try {
            // Service logic
            this.emit('action:success', result);
            return result;
        } catch (error) {
            this.emit('action:error', error);
            throw error;
        }
    }
}
```

### Styling Guidelines

#### CSS Architecture

- **CSS Variables**: All colors, spacing, and typography defined as variables
- **Component-based**: Styles organized by component
- **Responsive Design**: Mobile-first approach with breakpoints
- **Accessibility**: High contrast support, reduced motion support

#### Adding New Styles

1. Use existing CSS variables when possible
2. Follow BEM naming convention for new classes
3. Ensure responsive behavior
4. Test with accessibility tools

```css
/* Use existing variables */
.new-component {
    background: var(--background-primary);
    color: var(--text-primary);
    padding: var(--space-4);
    border-radius: var(--radius-md);
}

/* Follow BEM convention */
.chat-message {}
.chat-message__content {}
.chat-message--user {}
```

### Configuration Management

#### Environment Detection

The application automatically detects environment based on hostname:

- `localhost` or `127.0.0.1` → Development
- `*.github.io` or `*.pages.dev` → Production
- Other domains → Staging

#### Adding Configuration Options

1. Update `src/config/config.js`
2. Add to base config and environment-specific overrides
3. Access through ConfigService methods

```javascript
// In config.js
const baseConfig = {
    newFeature: {
        enabled: true,
        options: {}
    }
};

// In your code
const config = new ConfigService();
if (config.isFeatureEnabled('newFeature')) {
    // Feature logic
}
```

## Testing Strategy

### Manual Testing

1. **Cross-browser testing**: Chrome, Firefox, Safari, Edge
2. **Device testing**: Desktop, tablet, mobile
3. **Accessibility testing**: Screen readers, keyboard navigation
4. **Performance testing**: Network throttling, large messages

### Future Automated Testing

```javascript
// Unit tests (planned)
describe('ChatInterface', () => {
    test('should send message when send button clicked', () => {
        // Test implementation
    });
});

// Integration tests (planned)
describe('API Integration', () => {
    test('should handle API errors gracefully', () => {
        // Test implementation
    });
});
```

## Deployment

### GitHub Pages Setup

1. **Repository settings:**
   - Go to repository Settings → Pages
   - Set source to "Deploy from a branch"
   - Select `main` branch and `/ (root)` folder

2. **Custom domain (optional):**
   - Add CNAME file with your domain
   - Configure DNS settings

3. **Deployment process:**
   ```bash
   git add .
   git commit -m "feat: update frontend"
   git push origin main
   # GitHub Pages automatically deploys
   ```

### Production Considerations

1. **Performance:**
   - Minify CSS and JavaScript (future build step)
   - Optimize images and assets
   - Enable compression

2. **Security:**
   - CSP headers for XSS protection
   - HTTPS enforcement
   - Input sanitization

3. **Monitoring:**
   - Error tracking integration
   - Performance monitoring
   - User analytics (optional)

## Backend Integration

### API Contract

When the FastAPI backend is ready, it should implement:

```javascript
// POST /api/chat
{
    "message": "User message",
    "conversation_id": "conv_123",
    "history": [...],
    "timestamp": "2025-01-01T00:00:00Z"
}

// Response
{
    "reply": "Bot response",
    "message_id": "msg_456",
    "conversation_id": "conv_123",
    "timestamp": "2025-01-01T00:00:00Z",
    "model": "gpt-4",
    "usage": {
        "prompt_tokens": 50,
        "completion_tokens": 75,
        "total_tokens": 125
    }
}
```

### Integration Steps

1. Update `src/config/config.js` with backend URL
2. Set `demoMode: false` in production config
3. Uncomment `callBackendAPI` method in `ApiService.js`
4. Test API integration thoroughly

## Future Enhancements

### Phase 1: Core Features
- [ ] Message persistence (localStorage)
- [ ] Export chat history
- [ ] Dark mode toggle
- [ ] Keyboard shortcuts

### Phase 2: Advanced Features
- [ ] File upload support
- [ ] Voice input/output
- [ ] Multi-language support
- [ ] Custom themes

### Phase 3: ML Integration
- [ ] MLPlayground data visualization
- [ ] Credit risk model results display
- [ ] Interactive charts and graphs
- [ ] Model comparison tools

## Contributing

### Code Standards

1. **JavaScript:**
   - ES6+ features
   - Consistent naming (camelCase)
   - JSDoc comments for public methods
   - Error handling for all async operations

2. **CSS:**
   - Use CSS variables
   - Mobile-first responsive design
   - Semantic class names
   - Accessibility considerations

3. **Git:**
   - Conventional commit messages
   - Feature branches for new development
   - Pull requests for code review

### Pull Request Process

1. Fork the repository
2. Create feature branch: `git checkout -b feature/description`
3. Make changes following code standards
4. Test thoroughly across browsers/devices
5. Submit PR with clear description
6. Address review feedback

## Troubleshooting

### Common Issues

1. **Module loading errors:**
   - Ensure using a proper HTTP server (not file://)
   - Check browser console for CORS errors

2. **Styling issues:**
   - Clear browser cache
   - Check CSS variable support
   - Verify responsive breakpoints

3. **Performance issues:**
   - Monitor memory usage in dev tools
   - Check for event listener leaks
   - Optimize large message rendering

### Debug Mode

Enable debug mode by updating config:

```javascript
// In browser console
window.bitBotApp.config.updateConfig({
    debug: { enabled: true, logLevel: 'debug' }
});
```

This will enable verbose logging and additional debugging features.
