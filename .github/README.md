# BitBot Frontend Deployment

This directory contains the deployment configuration for the BitBot frontend.

## GitHub Pages Setup

The frontend is automatically deployed to GitHub Pages using GitHub Actions when changes are pushed to the `main` branch.

### Custom Domain Configuration

- **Domain**: `chat.vanshdeshwal.dev`
- **CNAME file**: Located in `frontend/CNAME`

### DNS Configuration Required

To complete the custom domain setup, configure your DNS provider with:

```
Type: CNAME
Name: chat
Value: vanshdeshwal.github.io
TTL: 300 (or your preferred value)
```

### GitHub Repository Settings

1. Go to your repository Settings → Pages
2. Select "GitHub Actions" as the source
3. The custom domain should automatically be detected from the CNAME file

### Deployment Workflow

The GitHub Action (`.github/workflows/deploy.yml`) will:

1. **Trigger on**:
   - Push to `main` branch (when frontend files change)
   - Manual workflow dispatch
   - Pull requests (for validation)

2. **Build Process**:
   - Checkout code
   - Setup Node.js environment
   - Install dependencies (if package.json exists)
   - Validate frontend structure
   - Upload frontend folder as Pages artifact

3. **Deploy Process**:
   - Deploy to GitHub Pages
   - Available at `https://chat.vanshdeshwal.dev`

### Local Development

The frontend can be developed locally by serving the `frontend` directory:

```bash
cd frontend
python -m http.server 8080
# or
npx serve .
```

Then access at `http://localhost:8080`

### Production URLs

- **Custom Domain**: https://chat.vanshdeshwal.dev
- **GitHub Domain**: https://vanshdeshwal.github.io/BitBot

Both URLs will serve the same content, but the custom domain provides a professional appearance.
