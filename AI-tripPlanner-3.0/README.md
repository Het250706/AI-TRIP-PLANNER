# AI Trip Planner 🌍

A production-ready AI-powered trip planning application built with React, Node.js, and MongoDB.

## Features 🚀

- **AI Itinerary Generation**: Uses OpenAI to generate detailed day-by-day travel plans.
- **Trip Persistence**: Save and manage your trips in MongoDB Atlas.
- **Structured JSON Data**: Validates AI responses before storage.
- **Dynamic Maps**: Integrated with Google Maps for place visualization.
- **User Authentication**: Secure JWT-based login with OTP verification via Resend.
- **Modern UI**: Built with Tailwind CSS, Framer Motion, and Lucide React.

## Tech Stack 🛠️

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Axios.
- **Backend**: Node.js, Express, Mongoose, OpenAI SDK.
- **Database**: MongoDB.
- **Services**: Resend (Email), Unsplash (Images), Google Maps API.

## Setup Instructions 📝

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB account (local or Atlas)
- OpenAI API Key
- Google Maps API Key
- Resend API Key

### 2. Backend Configuration
Create a `.env` file in the `backend/` directory:
\`\`\`env
PORT=5555
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
OPENAI_API_KEY=your_openai_api_key
RESEND_API_KEY=your_resend_api_key
GOOGLE_API_KEY=your_google_maps_api_key
FRONTEND_URL=http://localhost:5173
\`\`\`

### 3. Frontend Configuration
Create a `.env` file in the `frontend/` directory:
\`\`\`env
VITE_BACKEND_URL=http://localhost:5555
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_key
\`\`\`

### 4. Installation
Install dependencies for both frontend and backend:
\`\`\`bash
npm run install:all
\`\`\`

### 5. Running the Application
Start both servers simultaneously:
\`\`\`bash
npm run dev
\`\`\`

## API Documentation 📖

### Trip Endpoints
- \`POST /api/trip/generate\`: Generate a new AI itinerary.
- \`POST /api/trip/save\`: Save an itinerary to your profile.
- \`GET /api/trip/all\`: Retrieve all saved trips.
- \`GET /api/trip/:id\`: Retrieve a specific trip by ID.

### Auth Endpoints
- \`POST /auth/sendotp\`: Send OTP to email.
- \`POST /auth/register\`: Verify OTP and register.
- \`POST /auth/login\`: Standard login.

## License
MIT