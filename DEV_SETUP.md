# MuizenMesh Development Setup

## Prerequisites
- ✅ Node.js (v22.17.1)
- ✅ npm (10.9.2) 
- ✅ Netlify CLI installed

## Development Workflow

### 1. Start Development Server
```bash
# Using npm script
npm run dev

# Or directly with Netlify CLI
netlify dev
```

This will:
- Start a local server (usually http://localhost:8888)
- Handle redirects from netlify.toml
- Serve static files correctly
- Simulate Netlify's production environment

### 2. Test the Site
- Open http://localhost:8888 in your browser
- Test particle.js effects
- Test burger menu functionality
- Verify all navigation links work
- Test redirects (e.g., /bbs/ should redirect to Discord)

### 3. Build Process
Since this is a static site, there's no build step needed:
```bash
npm run build  # Just echoes "No build step needed"
```

### 4. Deploy to Staging
```bash
# Deploy to staging URL
npm run deploy
# or
netlify deploy
```

### 5. Deploy to Production
```bash
# Deploy to production domain
npm run deploy:prod
# or
netlify deploy --prod
```

## File Structure
```
/
├── index.html          # Main landing page
├── css/
│   ├── screen.css      # Main stylesheet
│   └── styles.css      # Additional styles
├── js/
│   ├── index.js        # Main JavaScript
│   ├── particles.js    # Particle effects config
│   └── particles.min.js # Particle.js library
├── images/             # Static images
├── mixer/              # Music mixer component
├── gallery/            # Gallery placeholder
├── netlify.toml        # Netlify configuration
└── package.json        # Development scripts

```

## Netlify Configuration

### Build Settings
- **Build command**: `echo 'No build step needed - static site'`
- **Publish directory**: `.` (root)
- **Functions directory**: Not used

### Redirects Configured
- `/bbs/*` → Discord community
- `/zen/*` → Gallery placeholder  
- `/wiki/*` → GitHub wiki
- `/lab/*` → GitHub repository
- `/wp/*` → GitHub repository
- `/store/*` → Email contact
- `/mix` → `/mixer` (path normalization)

### Headers Configured
- Security headers (XSS protection, frame options, etc.)
- Cache headers for static assets (1 year cache)

## Testing Checklist

### Local Development
- [ ] `netlify dev` starts without errors
- [ ] Site loads at http://localhost:8888
- [ ] Particle effects work
- [ ] Burger menu toggles properly
- [ ] All navigation links work
- [ ] CSS and JS load correctly

### Deployment Testing
- [ ] `netlify deploy` works (staging)
- [ ] Redirects work as expected
- [ ] Security headers present
- [ ] Performance is good
- [ ] Mobile responsive

## Troubleshooting

### Common Issues

1. **CSS/JS not loading locally**
   - Use `netlify dev` instead of opening index.html directly
   - Relative paths need a proper server

2. **Redirects not working**
   - Check netlify.toml syntax
   - Test with `netlify dev` first

3. **Particle effects not working**
   - Check browser console for errors
   - Verify particles.js and particles.min.js load

### Commands Reference
```bash
# Install Netlify CLI globally (if needed)
npm install -g netlify-cli

# Login to Netlify
netlify login

# Link to existing site (when ready)
netlify link

# Initialize new site
netlify init

# Check status
netlify status

# Open site in browser
netlify open
```

## Next Steps

1. **Test locally**: Run `netlify dev` and verify everything works
2. **Link repository**: Connect to Netlify dashboard
3. **Deploy staging**: Test on Netlify's servers
4. **Configure domain**: Set up custom domain when ready
5. **Monitor**: Set up analytics and monitoring