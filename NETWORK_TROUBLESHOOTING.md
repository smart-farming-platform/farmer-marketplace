# Network Connection Troubleshooting Guide

## Quick Fix for "Main Link Not Opening"

### Option 1: Use the Startup Script (Recommended)
**Windows:**
```bash
# Double-click start-local.bat
# OR run in Command Prompt:
start-local.bat
```

**Mac/Linux:**
```bash
chmod +x start-local.sh
./start-local.sh
```

### Option 2: Manual Startup
```bash
cd frontend
npm install
npm run dev
```

## Common Network Issues & Solutions

### 1. Port Already in Use
**Problem:** `Error: listen EADDRINUSE: address already in use :::5173`

**Solution:**
```bash
# Kill process using port 5173
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F

# Or use different port
npm run dev -- --port 3000
```

### 2. Firewall Blocking Connection
**Problem:** Browser can't connect to localhost

**Solutions:**
- Temporarily disable Windows Firewall
- Add exception for Node.js in firewall
- Try different browsers (Chrome, Firefox, Edge)
- Use 127.0.0.1 instead of localhost

### 3. Network Adapter Issues
**Problem:** Network connectivity problems

**Solutions:**
```bash
# Reset network stack (Windows)
ipconfig /flushdns
ipconfig /release
ipconfig /renew

# Reset Winsock
netsh winsock reset
```

### 4. Proxy/VPN Interference
**Problem:** Corporate proxy or VPN blocking local connections

**Solutions:**
- Disable VPN temporarily
- Configure proxy bypass for localhost
- Use mobile hotspot for testing

## Offline Mode Features

AgroConnect works offline with these features:
- ✅ Browse cached products
- ✅ View farmer profiles
- ✅ Use language switching
- ✅ Access weather information (cached)
- ✅ Voice chat functionality
- ✅ QR code scanning
- ❌ Real-time data updates
- ❌ New user registration
- ❌ Payment processing

## Debug Tools Available

### 1. Health Check Widget (Top-right corner)
- Shows frontend/backend status
- Network connectivity indicator
- Troubleshooting suggestions

### 2. Route Test Widget (Bottom-right corner)
- Test all navigation links
- Current route display
- Quick navigation buttons

### 3. Browser Console
Press F12 and check Console tab for:
- Network errors
- JavaScript errors
- Connection status logs

## Step-by-Step Troubleshooting

### Step 1: Basic Checks
1. ✅ Node.js installed? `node --version`
2. ✅ npm working? `npm --version`
3. ✅ In correct directory? Should see `package.json`
4. ✅ Dependencies installed? `npm install`

### Step 2: Network Checks
1. ✅ Internet connection working?
2. ✅ Can access other websites?
3. ✅ Firewall/antivirus blocking?
4. ✅ VPN/proxy interfering?

### Step 3: Port Checks
1. ✅ Port 5173 free? `netstat -ano | findstr :5173`
2. ✅ Try different port? `npm run dev -- --port 3000`
3. ✅ Browser cache cleared? Ctrl+F5

### Step 4: Alternative Solutions
1. 🔄 Try different browser
2. 🔄 Use incognito/private mode
3. 🔄 Restart computer
4. 🔄 Use mobile hotspot

## URLs to Try

If localhost doesn't work, try these alternatives:
- `http://localhost:5173`
- `http://127.0.0.1:5173`
- `http://0.0.0.0:5173`
- `http://[your-ip-address]:5173`

## Get Your IP Address

**Windows:**
```bash
ipconfig | findstr IPv4
```

**Mac/Linux:**
```bash
ifconfig | grep inet
```

## Emergency Offline Mode

If nothing works, the app includes offline mode:
1. Open browser
2. Go to any of the URLs above
3. App will detect network issues
4. Automatically switch to offline mode
5. Use cached data and mock services

## Contact Information

If you're still having issues:
1. Check browser console (F12)
2. Note any error messages
3. Try the debug widgets
4. Use offline mode as backup

The app is designed to work offline-first, so even without network connection, you can explore most features using cached data.

## Success Indicators

You'll know it's working when you see:
- ✅ AgroConnect homepage loads
- ✅ Navigation menu appears
- ✅ Debug widgets in corners
- ✅ No red errors in console
- ✅ Health check shows "OK" status