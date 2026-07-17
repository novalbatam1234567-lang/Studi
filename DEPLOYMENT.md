# 🚀 Deployment Guide - Studi App

## ⚡ Quick Start

### Development Mode
```bash
npm install
npm run dev
```
**URL**: http://localhost:3000 (atau port yang tersedia)

### Production Build
```bash
npm run build
npm run preview
```
**Build Output**: `dist/` folder  
**Preview URL**: http://localhost:4173

---

## 🌐 Deployment Options

### 1. **Netlify** (Recommended)
```bash
# Build command
npm run build

# Publish directory  
dist

# Environment variables (optional)
VITE_API_URL=https://your-api.com
```

**Deploy Steps:**
1. Push ke GitHub repository
2. Connect Netlify ke repo
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Deploy!

### 2. **Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 3. **GitHub Pages**
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"homepage": "https://username.github.io/repository-name",
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

### 4. **Firebase Hosting**
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login & init
firebase login
firebase init hosting

# Deploy
firebase deploy
```

### 5. **Apache/Nginx** (Manual)
```bash
# Build the app
npm run build

# Copy dist/ contents to web server
cp -r dist/* /var/www/html/
```

---

## ⚙️ Environment Configuration

### Environment Variables (.env.local)
```env
# API Configuration
VITE_API_URL=https://api.studi-app.com

# Feature Flags
VITE_ENABLE_OCR=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_ANALYTICS=false

# Analytics (optional)
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
VITE_HOTJAR_ID=123456789
```

### Build-time Variables
```bash
# Development
VITE_MODE=development

# Production
VITE_MODE=production
```

---

## 📋 Pre-deployment Checklist

### ✅ **Code Quality**
- [ ] All tests passing: `npm run test` (if available)
- [ ] Build successful: `npm run build`  
- [ ] No console errors in browser
- [ ] All routes accessible
- [ ] Forms working correctly

### ✅ **Performance**
- [ ] Images optimized (< 500KB each)
- [ ] Bundle size acceptable (< 1MB gzipped)
- [ ] Lazy loading implemented
- [ ] Font loading optimized

### ✅ **SEO & Meta**
- [ ] Meta tags configured
- [ ] Open Graph images present
- [ ] Favicon.ico exists
- [ ] robots.txt configured
- [ ] sitemap.xml generated (if needed)

### ✅ **Security**
- [ ] No sensitive data in frontend
- [ ] Environment variables properly set
- [ ] HTTPS redirect configured
- [ ] CSP headers (if needed)

### ✅ **Browser Testing**
- [ ] Chrome/Edge ✅
- [ ] Firefox ✅  
- [ ] Safari ✅
- [ ] Mobile Chrome ✅
- [ ] Mobile Safari ✅

---

## 🔧 Server Configuration

### Apache (.htaccess)
```apache
# Handle client-side routing
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Enable gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/plain
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/xml
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE application/xml
  AddOutputFilterByType DEFLATE application/xhtml+xml
  AddOutputFilterByType DEFLATE application/rss+xml
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Browser caching
<IfModule mod_expires.c>
  ExpiresActive on
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
</IfModule>
```

### Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/studi-app/dist;
    index index.html;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
```

---

## 📊 Performance Optimization

### Bundle Analysis
```bash
# Analyze bundle size
npm run build -- --analyze

# Or install bundle analyzer
npm install --save-dev rollup-plugin-analyzer
```

### Image Optimization
```bash
# Compress images before deployment
npm install -g imagemin-cli

# Compress
imagemin public/images/* --out-dir=public/images/optimized
```

### PWA Configuration (Optional)
```bash
# Install Vite PWA plugin
npm install vite-plugin-pwa --save-dev

# Add to vite.config.js
import { VitePWA } from 'vite-plugin-pwa'
```

---

## 🚨 Troubleshooting

### Common Issues

**❌ Build fails with "out of memory"**
```bash
# Increase Node.js memory
NODE_OPTIONS="--max_old_space_size=4096" npm run build
```

**❌ Routes not working (404 on refresh)**
- Configure server for SPA routing (see server config above)
- Check base path in vite.config.js

**❌ Images not loading**
- Check image paths (use relative paths)
- Verify images are in public/ folder
- Check case sensitivity (Linux servers)

**❌ Fonts not loading**
- Verify font preload links
- Check CORS headers for external fonts
- Ensure font files are included in build

**❌ Environment variables not working**
- Must start with `VITE_`
- Restart dev server after changes
- Check .env.local file location

---

## 📱 Mobile App (Future)

### Capacitor (Optional)
```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli

# Initialize
npx cap init StudiApp com.studi.app

# Add platforms
npx cap add ios
npx cap add android

# Build and sync
npm run build
npx cap sync
```

---

## 🎯 Production Monitoring

### Analytics Integration
```javascript
// Google Analytics 4
gtag('config', 'G-XXXXXXXXXX', {
  page_title: 'Studi App',
  page_location: window.location.href
})

// Error tracking
window.addEventListener('error', (event) => {
  gtag('event', 'exception', {
    description: event.error.toString()
  })
})
```

### Performance Monitoring
```javascript
// Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

getCLS(console.log)
getFID(console.log)  
getFCP(console.log)
getLCP(console.log)
getTTFB(console.log)
```

---

**🎉 Happy Deploying! 🚀**

Untuk pertanyaan deployment, silakan check dokumentasi hosting provider atau buat issue di repository.