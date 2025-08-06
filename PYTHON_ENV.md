# BitBot Python Environment Setup

## Virtual Environment

A Python virtual environment has been created for the BitBot project:

- **Environment Name**: `bitbot-env`
- **Python Version**: 3.13.5
- **Location**: `c:\Github\BitBot\bitbot-env\`

## Activation

### Windows (PowerShell)
```powershell
.\bitbot-env\Scripts\Activate.ps1
```

### Windows (Command Prompt)
```cmd
.\bitbot-env\Scripts\activate.bat
```

### Verification
```bash
# Check if environment is active (should show bitbot-env)
python --version
which python  # Should point to bitbot-env directory
```

## Package Installation

### Backend Dependencies
```bash
# Install main dependencies
pip install -r backend/requirements.txt

# Install development dependencies
pip install -r backend/requirements-dev.txt
```

### Key Packages Included

#### Core Framework
- **FastAPI**: Modern Python web framework
- **Uvicorn**: ASGI server for production
- **Pydantic**: Data validation and serialization

#### AI & Machine Learning
- **LangChain**: LLM application framework
- **LangGraph**: Stateful multi-agent workflows
- **OpenAI**: GPT model integration
- **Sentence Transformers**: Text embeddings

#### Database & Storage
- **SQLAlchemy**: ORM for database operations
- **PostgreSQL**: Database driver (psycopg2)
- **Redis**: Caching and session storage
- **Alembic**: Database migrations

#### Development Tools
- **pytest**: Testing framework
- **Black**: Code formatting
- **mypy**: Type checking
- **pre-commit**: Git hooks

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Application
ENVIRONMENT=development
DEBUG=True
SECRET_KEY=your-secret-key-here

# Database
DATABASE_URL=postgresql://user:password@localhost/bitbot
REDIS_URL=redis://localhost:6379

# AI Services
OPENAI_API_KEY=your-openai-key
AZURE_OPENAI_ENDPOINT=your-azure-endpoint

# External APIs
MLPLAYGROUND_API_URL=your-ml-playground-url
CREDIT_RISK_API_URL=your-credit-risk-url

# Azure
AZURE_STORAGE_CONNECTION_STRING=your-azure-storage
```

## Development Workflow

### 1. Activate Environment
```bash
.\bitbot-env\Scripts\Activate.ps1
```

### 2. Install Dependencies
```bash
pip install -r backend/requirements-dev.txt
```

### 3. Run Development Server (when backend is implemented)
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Run Tests
```bash
pytest backend/tests/ -v --cov=backend/
```

### 5. Code Quality Checks
```bash
# Format code
black backend/
isort backend/

# Type checking
mypy backend/

# Linting
flake8 backend/
```

## Project Integration

This virtual environment is ready for:

1. **FastAPI Backend Development**
2. **LangChain AI Integration**
3. **Database Operations**
4. **Testing and Quality Assurance**
5. **MLPlayground Integration**
6. **Credit Risk Model Connectivity**

## Deactivation

To deactivate the virtual environment:
```bash
deactivate
```

## Troubleshooting

### Common Issues

1. **Execution Policy Error (Windows)**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

2. **Package Installation Errors**
   ```bash
   python -m pip install --upgrade pip
   pip install --upgrade setuptools wheel
   ```

3. **Environment Not Found**
   ```bash
   # Recreate the environment
   python -m venv bitbot-env
   ```

The virtual environment is now ready for BitBot backend development with all the planned AI and web framework dependencies!
