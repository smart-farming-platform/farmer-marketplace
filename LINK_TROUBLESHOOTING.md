# 🔗 Link Not Opening - Complete Troubleshooting Guide

## 🚨 IMMEDIATE SOLUTIONS

### Option 1: Use Emergency Startup Page
1. **Open `emergency-start.html`** in your browser
2. **Click "Test Port" buttons** to find working server
3. **Use direct links** if server is running

### Option 2: Quick Diagnostic
1. **Press `Ctrl+D`** in your app to open Link Diagnostic
2. **Check all status indicators**
3. **Use test navigation buttons**

### Option 3: Manual Server Start
```bash
# Open terminal in project folder
cd frontend
npm install
npm run dev

# If port 5173 is busy, try:
npm run dev -- --port 3000
```

## 🔍 IDENTIFY THE PROBLEM

### Check These First:
1. **Is the development server running?**
   - Look for "Local: http://localhost:5173" in terminal
   - If not running: `cd frontend && npm run dev`

2. **Are you on the right URL?**
   - Try: `http://localhost:5173`
   - Try: `http://localhost:3000`
   - Try: `http://127.0.0.1:5173`

3. **Browser console errors?**
   - Press `F12` → Console tab
   - Look for red error messages

## 🛠️ STEP-BY-STEP FIXES

### Step 1: Server Issues
```bash
# Check if server is running
netstat -ano | findstr :5173

# If nothing shows, start server:
cd frontend
npm run dev

# If port is busy, kill process:
# Windows:
taskkill /PID <PID_NUMBER> /F
# Mac/Linux:
kill -9 <PID_NUMBER>
```

### Step 2: Browser Issues
1. **Hard refresh:** `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
2. **Clear cache:** `Ctrl+Shift+Delete`
3. **Try incognito mode**
4. **Try different browser**

### Step 3: Network Issues
```bash
# Flush DNS (Windows)
ipconfig /flushdns

# Reset network (Windows)
netsh winsock reset

# Check hosts file
# Windows: C:\Windows\System32\drivers\etc\hosts
# Mac/Linux: /etc/hosts
```

### Step 4: JavaScript Issues
1. **Check if JavaScript is enabled**
2. **Disable browser extensions**
3. **Check for ad blockers**
4. **Update browser**

## 🎯 SPECIFIC LINK PROBLEMS

### Problem: "Dashboard/Profile not opening"
**Cause:** Authentication required
**Solution:** 
1. Use Quick Login widget (top-left)
2. Click "Login as Farmer" or "Login as Consumer"
3. Now try `/dashboard/profile`

### Problem: "Links do nothing when clicked"
**Cause:** JavaScript/React Router issues
**Solutions:**
1. Check browser console for errors
2. Hard refresh the page
3. Clear browser cache
4. Restart development server

### Problem: "Page shows 'Cannot GET /dashboard'"
**Cause:** Server-side routing issue
**Solution:**
1. This is normal for Vite dev server
2. Navigate from home page using menu
3. Or refresh from home page first

### Problem: "Blank page after clicking link"
**Cause:** Component loading error
**Solutions:**
1. Check console for component errors
2. Check if all imports are correct
3. Restart development server

## 🔧 ADVANCED TROUBLESHOOTING

### Check React Router Setup
```javascript
// In main.jsx, ensure BrowserRouter is present:
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
```

### Check Component Imports
```javascript
// In App.jsx, ensure all components are imported:
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
// etc.
```

### Check Route Configuration
```javascript
// In App.jsx, ensure routes are properly configured:
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/dashboard/*" element={<Dashboard />} />
</Routes>
```

## 🚀 EMERGENCY RECOVERY

### If Nothing Works:
1. **Complete restart:**
   ```bash
   # Kill all Node processes
   taskkill /f /im node.exe
   
   # Restart server
   cd frontend
   npm run dev
   ```

2. **Nuclear option (reinstall):**
   ```bash
   # Delete node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   ```

3. **Use emergency HTML file:**
   - Open `emergency-start.html` in browser
   - Use direct links and diagnostics

## 📱 MOBILE/RESPONSIVE ISSUES

If links work on desktop but not mobile:
1. **Check viewport meta tag**
2. **Test on different devices**
3. **Check touch event handlers**
4. **Disable mobile-specific extensions**

## 🔍 DEBUG TOOLS AVAILABLE

### In Your App:
1. **Health Check Widget** (top-right) - Shows system status
2. **Route Test Widget** (bottom-right) - Test all routes
3. **Quick Login Widget** (top-left) - For protected routes
4. **Link Diagnostic** (Ctrl+D) - Comprehensive link testing

### Browser Tools:
1. **Developer Tools** (F12)
2. **Network tab** - Check failed requests
3. **Console tab** - Check JavaScript errors
4. **Application tab** - Check local storage

## ✅ SUCCESS INDICATORS

You'll know links are working when:
- ✅ Clicking navigation menu changes URL
- ✅ Page content updates without full reload
- ✅ Browser back/forward buttons work
- ✅ No console errors
- ✅ Debug widgets show green status

## 📞 STILL NEED HELP?

1. **Open emergency-start.html** for automated diagnostics
2. **Press Ctrl+D** in your app for link diagnostic
3. **Check browser console** (F12) for specific errors
4. **Try different browser/incognito mode**
5. **Restart computer** as last resort

Remember: The app is designed to work offline, so even without perfect network connectivity, basic navigation should work!