# Backend API

A simple Express.js backend server with Google Gemini AI integration for job processing.

## Features

- Express.js web framework
- Google Gemini AI integration
- CORS enabled for cross-origin requests
- Security headers with Helmet
- Request logging with Morgan
- JSON request/response handling
- Error handling middleware
- Health check endpoint
- Jobs API with quote and execute endpoints

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google API Key for Gemini AI

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your Google API key:
   ```bash
   GOOGLE_API_KEY=your_google_api_key_here
   PORT=3000
   NODE_ENV=development
   ```

### Running the Server

#### Development mode (with auto-restart):
```bash
npm run dev
```

#### Production mode:
```bash
npm start
```

The server will start on port 3000 by default, or the port specified in the `PORT` environment variable.

## API Endpoints

### GET /health
- **Description**: Health check endpoint
- **Response**: JSON object with status, timestamp, and uptime

### POST /api/jobs/quote
- **Description**: Get an AI-generated quote/response using Gemini AI
- **Body**: 
  ```json
  {
    "prompt": "Your prompt text here"
  }
  ```
- **Response**: JSON object with quote, prompt, and timestamp

### POST /api/jobs/execute-job
- **Description**: Execute a job using Gemini AI
- **Body**: 
  ```json
  {
    "jobId": "unique-job-id",
    "prompt": "Your prompt text here",
    "parameters": {}
  }
  ```
- **Response**: JSON object with jobId, result, prompt, parameters, status, and timestamp

## Environment Variables

- `GOOGLE_API_KEY`: Your Google Gemini AI API key (required)
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)

## Error Handling

The server includes comprehensive error handling:
- 400 errors for bad requests (missing required fields)
- 500 errors for server errors and AI API failures
- 404 errors for unknown routes
- JSON error responses with descriptive messages

## Security

The server uses Helmet.js to set security headers and protect against common vulnerabilities.
