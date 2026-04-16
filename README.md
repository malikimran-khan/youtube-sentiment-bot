# VoxTube AI - YouTube Sentiment Intelligence

<div align="center">
  <img src="client/public/icon.svg" alt="VoxTube AI Logo" width="80" height="80">
  <h1>VoxTube AI</h1>
  <p><strong>Unlocking the emotional pulse of your YouTube audience with advanced neural analysis</strong></p>
</div>

---

## 📋 Table of Contents

- [🎯 What is VoxTube AI?](#-what-is-voxtube-ai)
- [🚀 Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📦 Installation & Setup](#-installation--setup)
- [🔧 Environment Variables](#-environment-variables)
- [🏃‍♂️ Running the Application](#️-running-the-application)
- [🌐 API Endpoints](#-api-endpoints)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🎯 What is VoxTube AI?

VoxTube AI is an intelligent YouTube sentiment analysis tool that helps content creators, marketers, and researchers understand their audience's emotional response to videos. Using advanced AI and machine learning, it analyzes YouTube comments to provide deep insights into viewer sentiment, opinions, and engagement patterns.

### 🎯 Purpose

- **Content Creators**: Understand how your audience truly feels about your videos
- **Marketers**: Analyze campaign effectiveness and audience reactions
- **Researchers**: Study public opinion and sentiment trends
- **Businesses**: Monitor brand perception and customer feedback

---

## 🚀 Features

### ✨ Core Features
- 🔍 **Real-time Analysis**: Instant sentiment analysis of YouTube comments
- 🤖 **AI-Powered Insights**: Advanced neural networks for accurate sentiment detection
- 📊 **Visual Analytics**: Beautiful, interactive sentiment visualizations
- 🎯 **Smart Sampling**: Intelligent comment selection for comprehensive analysis
- ⚡ **Fast Processing**: Optimized scraping and analysis algorithms

### 🛡️ Production-Ready
- 🔒 **Security First**: Rate limiting, CORS protection, and secure headers
- 🚀 **Scalable Architecture**: Built for high-performance deployments
- 🐳 **Container Ready**: Docker deployment support
- 📱 **Responsive Design**: Works perfectly on all devices

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks and concurrent features
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Axios** - HTTP client for API communication
- **Lucide React** - Beautiful, consistent icons

### Backend
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Fast, unopinionated web framework
- **Puppeteer** - Headless browser for YouTube scraping
- **OpenAI GPT** - Advanced AI for sentiment analysis
- **Helmet** - Security middleware
- **Express Rate Limit** - API rate limiting
- **CORS** - Cross-origin resource sharing

---

## 📦 Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **OpenAI API Key** (for AI analysis)

### Clone the Repository
```bash
git clone https://github.com/yourusername/voxtube-ai.git
cd voxtube-ai
```

### Install Dependencies

#### Frontend
```bash
cd client
npm install
```

#### Backend
```bash
cd ../server
npm install
```

---

## 🔧 Environment Variables

Create environment files in their respective directories:

### Frontend (.env)
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000
```

### Backend (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# AI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here

# Optional: Puppeteer Configuration (for production)
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
```

> **⚠️ Security Note**: Never commit your `.env` files to version control. They are already included in `.gitignore`.

---

## 🏃‍♂️ Running the Application

### Development Mode

#### Start Backend Server
```bash
cd server
npm run dev
```
Server will start on `http://localhost:5000`

#### Start Frontend Client
```bash
cd client
npm run dev
```
Client will start on `http://localhost:5173`

### Production Mode

#### Build Frontend
```bash
cd client
npm run build
```

#### Start Production Server
```bash
cd server
npm start
```

---

## 🌐 API Endpoints

### POST `/api/analyze`
Analyze YouTube video comments for sentiment.

**Request:**
```json
{
  "videoUrl": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:**
```json
{
  "sentimentAnalysis": "Overall positive sentiment with 85% approval rating...",
  "commentsCount": 50
}
```

### GET `/health`
Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "environment": "production",
  "cors": "enabled"
}
```

### GET `/api/debug`
Debug endpoint to test server configuration and CORS.

**Response:**
```json
{
  "message": "Debug endpoint working",
  "origin": "https://your-frontend-domain.com",
  "method": "GET",
  "headers": {...},
  "timestamp": "2024-01-01T12:00:00.000Z",
  "environment": "production",
  "vercel": true
}
```

---

## 🚀 Deployment

### Quick Deploy

#### Railway (Recommended)
1. Connect your GitHub repository
2. Set environment variables in Railway dashboard
3. Deploy automatically

#### Render
1. Create a new Web Service
2. Connect your repository
3. Set environment variables
4. Deploy

#### Docker Deployment
```dockerfile
# Build the frontend
cd client && npm run build

# Use the provided Dockerfile in server directory
cd ../server
docker build -t voxtube-ai .
docker run -p 5000:5000 voxtube-ai
```

#### Vercel (Serverless)
1. **Deploy Backend First:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Deploy server
   cd server
   vercel --prod
   ```
   Copy the deployment URL (e.g., `https://youtube-sentiment-bot.vercel.app`)

2. **Update Frontend Environment:**
   ```env
   VITE_API_BASE_URL=https://your-vercel-api-url.vercel.app
   ```

3. **Deploy Frontend:**
   ```bash
   cd client
   vercel --prod
   ```

   **Note:** If you encounter CORS issues after deployment, try these steps:
   1. Test the CORS endpoint: `GET https://your-api-url.vercel.app/api/test-cors`
   2. Redeploy the backend: `cd server && vercel --prod`
   3. Update frontend environment variables if needed
   4. Clear browser cache and try again

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
OPENAI_API_KEY=your_production_api_key
VITE_API_BASE_URL=https://your-api-domain.com
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow ESLint configuration
- Write clear, concise commit messages
- Test your changes thoroughly
- Update documentation as needed

---

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ for content creators and data enthusiasts**

[⭐ Star this repo](https://github.com/yourusername/voxtube-ai) • [🐛 Report Issues](https://github.com/yourusername/voxtube-ai/issues) • [💬 Discussions](https://github.com/yourusername/voxtube-ai/discussions)

</div>