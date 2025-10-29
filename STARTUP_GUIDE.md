# AgroConnect Startup Guide

## Quick Start Instructions

### 1. Start the Backend Server
```bash
cd backend
npm install
npm start
```
The backend will run on `http://localhost:5000`

### 2. Start the Frontend Development Server
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

### 3. Open Your Browser
Navigate to the URL shown in your terminal (usually `http://localhost:5173`)

## Troubleshooting

### If Links Are Not Working:

1. **Check if the dev server is running:**
   - Look for "Local: http://localhost:5173" in your terminal
   - Make sure there are no error messages

2. **Check browser console:**
   - Press F12 to open developer tools
   - Look for any red error messages in the Console tab

3. **Verify routing:**
   - You should see a "Route Test" widget in the bottom-right corner
   - Click on different routes to test navigation

4. **Common Issues:**
   - **Port already in use:** Try `npm run dev -- --port 3000`
   - **Node modules missing:** Run `npm install` in both frontend and backend
   - **Browser cache:** Try hard refresh (Ctrl+F5) or incognito mode

### If You See Blank Page:

1. Check browser console for errors
2. Verify that `http://localhost:5173` is accessible
3. Try clearing browser cache
4. Check if all dependencies are installed

### Development Commands:

```bash
# Frontend
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Backend
cd backend
npm start            # Start backend server
npm run dev          # Start with nodemon (auto-restart)
```

## Features Available:

✅ **Home Page** - Main landing page with features overview
✅ **Products** - Browse and search products
✅ **Farmers** - Find nearby farmers with GPS
✅ **Market Intelligence** - Price alerts and market trends
✅ **Smart Weather** - Weather-based farming recommendations
✅ **Multi-language** - 6 Indian languages supported
✅ **Voice Chat** - Voice interaction in multiple languages
✅ **AI Features** - Crop disease detection and farming advice
✅ **Offline Mode** - Works without internet connection

## Project Structure:
```
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── i18n/          # Language translations
├── backend/           # Node.js + Express backend
│   ├── routes/        # API routes
│   ├── models/        # Database models
│   └── services/      # Business logic
└── README.md
```

## Need Help?

1. Check this guide first
2. Look at browser console for errors
3. Verify both frontend and backend are running
4. Try the Route Test widget for navigation debugging

Happy coding! 🚀