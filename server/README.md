# VoxTube AI Server

YouTube sentiment analysis API server built with Express.js, Puppeteer, and OpenAI.

## Features

- CORS enabled for all origins (*)
- Rate limiting (100 requests per 15 minutes per IP)
- Security headers with Helmet
- YouTube comment scraping with Puppeteer
- AI-powered sentiment analysis with OpenAI GPT
- Production-ready error handling and logging

## Environment Variables

Create a `.env` file in the server directory:

```env
PORT=5000
NODE_ENV=production
OPENAI_API_KEY=your_openai_api_key_here
PUPPETEER_EXECUTABLE_PATH=/path/to/chromium (optional, for production)
```

## Installation

```bash
npm install
```

## Running

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## API Endpoints

### POST /api/analyze
Analyzes YouTube video comments for sentiment.

**Request Body:**
```json
{
  "videoUrl": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:**
```json
{
  "sentimentAnalysis": "AI-generated analysis text...",
  "commentsCount": 50
}
```

### GET /health
Health check endpoint.

## Production Deployment

### Environment Setup
- Set `NODE_ENV=production`
- Ensure OpenAI API key is set
- For containerized deployments, install Chromium dependencies

### Docker Example
```dockerfile
FROM node:18-alpine

# Install Chromium dependencies
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Set Puppeteer to use installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Cloud Platforms
- **Railway/Render**: Set environment variables in dashboard
- **Heroku**: Use config vars
- **Vercel**: Use environment variables in project settings

## Security Notes

- API key is stored securely in environment variables
- Rate limiting prevents abuse
- CORS allows all origins for flexibility
- Helmet provides security headers
- Error messages are sanitized in production

## Dependencies

- Express.js for API server
- Puppeteer for web scraping
- OpenAI for AI analysis
- Helmet for security
- Express Rate Limit for API protection