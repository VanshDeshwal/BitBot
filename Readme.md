# BitBot

An intelligent AI chatbot powered by LangChain, LangGraph, and FastAPI, designed to integrate with MLPlayground and Credit Risk modeling systems.

## 🚀 Project Overview

BitBot is a comprehensive AI assistant solution that combines modern web technologies with advanced AI capabilities:

- **Frontend**: Modern vanilla JavaScript with modular architecture
- **Backend**: FastAPI with LangChain and LangGraph (in development)
- **Integration**: MLPlayground and Credit Risk Model connectivity
- **Deployment**: Frontend on GitHub Pages, Backend on Azure

## 📁 Project Structure

> **Interview Note**: This repository demonstrates full-stack project planning and enterprise-level architecture, even though only the frontend is currently deployed.

```
BitBot/
├── frontend/                 # 🚀 DEPLOYED: Frontend application (GitHub Pages)
│   ├── index.html           # Main entry point
│   ├── CNAME                # Custom domain configuration
│   ├── package.json         # Dependencies and scripts
│   └── src/
│       ├── app.js           # Application initialization
│       ├── components/      # Reusable UI components
│       │   └── ChatInterface.js  # Main chat interface
│       ├── services/        # API and external services
│       │   └── ApiService.js     # Backend communication layer
│       ├── utils/           # Utility functions and helpers
│       │   ├── EventEmitter.js   # Custom event system
│       │   ├── DOMHelper.js      # DOM manipulation utilities
│       │   └── MessageFormatter.js # Text formatting & sanitization
│       ├── config/          # Configuration management
│       │   └── config.js         # Environment-aware configuration
│       └── assets/          # Static assets
│           └── css/
│               └── main.css      # Comprehensive styling system
├── backend/                 # 📋 PLANNED: FastAPI backend architecture
│   ├── app/                 # (Ready for FastAPI application)
│   ├── models/              # (Database models)
│   ├── services/            # (Business logic layer)
│   ├── api/                 # (API routes and endpoints)
│   └── requirements.txt     # (Python dependencies)
├── docs/                    # 📚 Documentation and guides
│   └── DEVELOPMENT.md       # Comprehensive development guide
├── tests/                   # 🧪 Testing infrastructure (ready for implementation)
│   ├── frontend/            # (Frontend unit and integration tests)
│   └── backend/             # (Backend API tests)
├── scripts/                 # 🛠️ Build and deployment automation
│   ├── deploy/              # (Deployment scripts)
│   └── build/               # (Build automation)
├── .github/                 # ⚙️ CI/CD and automation
│   ├── workflows/           # GitHub Actions
│   │   └── deploy.yml       # Automated deployment pipeline
│   └── README.md            # Deployment documentation
├── .gitignore              # Git ignore configuration
└── README.md               # This comprehensive documentation
```

### **Architecture Highlights for Technical Interviews**

**🏗️ Enterprise-Level Planning:**
- Modular frontend architecture with separation of concerns
- Service layer abstraction for API communication
- Event-driven architecture with custom event system
- Configuration management for multiple environments

**🚀 DevOps & Deployment:**
- GitHub Actions CI/CD pipeline
- Custom domain with professional subdomain
- Environment-aware configuration
- Automated deployment validation

**📈 Scalability Considerations:**
- Backend folder structure ready for FastAPI implementation
- Microservices-ready architecture
- Testing infrastructure prepared
- Documentation-driven development

## 🛠️ Technologies

### Frontend
- **Vanilla JavaScript** (ES6+ Modules)
- **CSS3** with CSS Variables
- **Modern Web APIs** (Fetch, Intersection Observer, etc.)
- **Responsive Design** with mobile-first approach
- **Accessibility** (ARIA labels, keyboard navigation)

### Backend (Planned)
- **FastAPI** - High-performance Python web framework
- **LangChain** - LLM application framework
- **LangGraph** - Stateful multi-agent workflows
- **Azure** - Cloud hosting and services
- **PostgreSQL/Redis** - Data storage and caching

### Integrations
- **MLPlayground** - Machine learning experimentation
- **Credit Risk Models** - Financial risk assessment
- **GitHub Pages** - Frontend hosting

## 🚀 Getting Started

### Prerequisites
- Modern web browser with ES6+ support
- Node.js (for development tools, optional)
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/VanshDeshwal/BitBot.git
   cd BitBot
   ```

2. **Run locally:**
   ```bash
   # Simply open the frontend/index.html in your browser
   # Or use a local server:
   cd frontend
   python -m http.server 8080  # Python
   # or
   npx serve .                  # Node.js
   ```

3. **Access the application:**
   - Open `http://localhost:8080` in your browser
   - The app will run in demo mode with mock responses

## 🏗️ Development

### Architecture Principles
- **Modular Design**: Separation of concerns with clear module boundaries
- **Event-Driven**: Loose coupling through event emitters
- **Configuration-Based**: Environment-specific settings
- **Extensible**: Easy to add new features and components
- **Testable**: Clear interfaces for unit and integration testing

### Key Components

#### ChatInterface
- Main UI component for chat interaction
- Handles message display, input, and user events
- Extensible for different message types

#### ApiService
- Manages all backend communication
- Implements retry logic and error handling
- Supports both real API and mock responses

#### ConfigService
- Environment-aware configuration management
- Supports development, staging, and production environments
- Feature flags and runtime configuration updates

### Adding New Features

1. **New Components**: Add to `src/components/`
2. **New Services**: Add to `src/services/`
3. **New Utilities**: Add to `src/utils/`
4. **Styling**: Update `src/assets/css/main.css`

## 🎨 UI/UX Features

- **Modern Chat Interface**: Clean, intuitive design
- **Real-time Typing Indicators**: Visual feedback during bot responses
- **Responsive Design**: Optimized for desktop and mobile
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Dark Mode Ready**: CSS variables for easy theming
- **Smooth Animations**: Subtle transitions and micro-interactions

## 🔧 Configuration

The application supports multiple environments:

- **Development**: Local development with debug features
- **Staging**: Pre-production testing environment
- **Production**: Live deployment on GitHub Pages

Configuration is managed through `src/config/config.js` with environment detection.

## 🚀 Deployment

### GitHub Pages (Frontend)
The frontend is automatically deployed using GitHub Actions:

1. Push changes to the `main` branch (frontend folder)
2. GitHub Actions automatically builds and deploys
3. Available at custom domain: `https://chat.vanshdeshwal.dev`
4. Also accessible at: `https://vanshdeshwal.github.io/BitBot`

#### DNS Configuration
Configure your DNS provider with:
```
Type: CNAME
Name: chat
Value: vanshdeshwal.github.io
```

### Azure (Backend - Coming Soon)
Backend deployment will use Azure services:
- Azure App Service for FastAPI application
- Azure Database for data storage
- Azure Cognitive Services for AI capabilities

## 🔮 Upcoming Features

### Phase 1: Backend Integration
- [ ] FastAPI backend setup
- [ ] LangChain integration
- [ ] LangGraph workflow implementation
- [ ] Azure deployment pipeline

### Phase 2: ML Integration
- [ ] MLPlayground connectivity
- [ ] Credit Risk Model integration
- [ ] Data visualization components
- [ ] Model performance dashboards

### Phase 3: Advanced Features
- [ ] Multi-user support
- [ ] Chat history persistence
- [ ] File upload capabilities
- [ ] Voice interaction
- [ ] Mobile app (PWA)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes following the coding standards
4. Test your changes thoroughly
5. Submit a pull request with a clear description

## 📝 License

MIT © Vansh Deshwal

## 👨‍💻 Author

**Vansh Deshwal**
- GitHub: [@VanshDeshwal](https://github.com/VanshDeshwal)

## 🙏 Acknowledgments

- LangChain community for AI frameworks
- FastAPI team for the amazing web framework
- Open source community for inspiration and tools

---

**Note**: This project is actively under development. The backend integration and ML connectivity features are coming soon!
