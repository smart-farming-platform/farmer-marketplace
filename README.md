# 🌱 AgroConnect - Smart Farming Platform

A comprehensive digital platform connecting farmers with consumers, featuring AI-powered crop recommendations, real-time weather monitoring, video calling, QR code scanning, GPS tracking, and integrated marketplace solutions.

![AgroConnect](https://img.shields.io/badge/AgroConnect-Smart%20Farming-4ade80?style=for-the-badge&logo=leaf)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

## 🚀 Features

### 🌡️ **Smart Weather System**
- **Real-time weather monitoring** with GPS integration
- **Temperature-based crop suggestions** with AI recommendations  
- **5-day weather forecasts** for farming planning
- **Weather alerts** for extreme conditions
- **Irrigation guidance** based on rainfall predictions

### 🌾 **Intelligent Crop Management**
- **AI-powered crop recommendations** based on temperature, season, and soil conditions
- **Crop disease detection** using image recognition
- **Growth stage tracking** and care instructions
- **Harvest timing optimization**
- **Seasonal planting calendars**

### 🛒 **Integrated Marketplace**
- **Direct farmer-to-consumer** sales platform
- **Real-time pricing** and market intelligence
- **Quality assurance** and rating systems
- **Secure payment processing**
- **Order tracking** and delivery management

### 📱 **Modern Technology Features**
- **QR Code scanning** for product information and payments
- **GPS tracking** for location-based services
- **Video calling** for customer support
- **Voice chat** capabilities
- **Offline functionality** for rural connectivity
- **Multi-language support** (i18n)

### 🔧 **Developer & Debug Tools**
- **Comprehensive debugging** tools (Ctrl+Shift+D)
- **Network diagnostics** and troubleshooting
- **Mobile-optimized** scanner helpers
- **Responsive design** for all devices
- **Health monitoring** and performance tracking

### 🤖 **AI-Powered Features**
- **Intelligent Chatbot**: AI-powered customer support with natural language processing
- **Smart Recommendations**: Personalized product suggestions based on purchase history
- **Farming Advice**: AI agricultural advisor for farmers with expert guidance
- **Price Predictions**: Market analysis and pricing insights
- **Quality Assessment**: AI-powered product quality evaluation

## 🛠️ Technology Stack

### **Frontend**
- **React 18** with modern hooks and context
- **Tailwind CSS** for responsive styling
- **Lucide React** for beautiful icons
- **React Router** for navigation
- **i18next** for internationalization
- **WebRTC** for video/audio calling

### **Backend**
- **Node.js** with Express framework
- **RESTful API** architecture
- **JWT authentication**
- **File upload handling**
- **CORS enabled**
- **MongoDB** with Mongoose ODM

### **Advanced Features**
- **Canvas API** for QR code generation
- **Geolocation API** for GPS features
- **Local Storage** for offline functionality
- **Service Workers** for PWA capabilities
- **WebSocket** for real-time updates

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd farm-marketplace
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   cd backend
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/farm-marketplace
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   ```

4. **Create upload directories**
   ```bash
   mkdir -p backend/uploads/products
   mkdir -p backend/uploads/avatars
   ```

5. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend API server on http://localhost:5000
   - Frontend React app on http://localhost:3000

6. **Optional: Enable AI Features**
   
   For advanced AI-powered features, see [AI_SETUP.md](AI_SETUP.md) for OpenAI integration instructions.
   
   The application works fully without AI - it's an optional enhancement!

## 🎯 Live Demo Features

### **Interactive Demos** (Available at these routes)
- **🏠 Home**: `/` - Main dashboard with all features
- **🌡️ Weather Dashboard**: `/weather` - Smart weather monitoring and crop suggestions
- **📱 QR Code Demo**: `/qr-demo` - Test QR generation and scanning
- **📍 GPS Tracking**: `/gps-tracking` - Location-based services
- **📹 Video Call Demo**: `/video-call-demo` - Communication features
- **🛒 Marketplace**: `/products` - Browse and purchase products
- **👨‍🌾 Farmers**: `/farmers` - Connect with local farmers

### **Debug Tools** (Development Mode)
- Press `Ctrl+Shift+D` to access developer tools
- Network diagnostics and health checks
- Route testing and link validation
- Quick login for testing

## 🌐 GitHub Repository Setup

### **Create Your GitHub Repository**

1. **Go to GitHub.com** and create a new repository
2. **Repository name**: `agroconnect-farming-platform`
3. **Description**: `Smart farming platform with weather prediction, crop suggestions, and marketplace`
4. **Make it Public** for open source collaboration

### **Connect Your Local Project**
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Initial commit
git commit -m "🌱 Initial commit: AgroConnect Smart Farming Platform

Features:
- Weather-based crop recommendations
- QR code scanning and generation
- GPS tracking and location services
- Video calling for customer support
- Integrated marketplace
- AI-powered farming advice
- Multi-language support
- Offline functionality"

# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/agroconnect-farming-platform.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### **Your GitHub Link Will Be**
```
https://github.com/YOUR_USERNAME/agroconnect-farming-platform
```

### **Add GitHub Pages (Optional)**
To deploy your app on GitHub Pages:
```bash
npm run build
git add dist/
git commit -m "📦 Add production build"
git subtree push --prefix frontend/dist origin gh-pages
```

Your live demo will be at: `https://YOUR_USERNAME.github.io/agroconnect-farming-platform`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (farmers only)
- `PUT /api/products/:id` - Update product (farmers only)
- `DELETE /api/products/:id` - Delete product (farmers only)

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/farmer` - Get farmer orders
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id/status` - Update order status (farmers only)

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/farmers` - Get all farmers (public)

## Project Structure

```
farm-marketplace/
├── backend/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── uploads/         # File uploads
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── contexts/    # React contexts
│   │   └── main.jsx     # App entry point
│   └── public/          # Static assets
└── README.md
```

## Demo Accounts

For testing purposes, you can use these demo accounts:

**Farmer Account:**
- Email: farmer@demo.com
- Password: demo123

**Consumer Account:**
- Email: consumer@demo.com
- Password: demo123

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@farmmarketplace.com or create an issue in the repository."# farmer-marketplace" 
