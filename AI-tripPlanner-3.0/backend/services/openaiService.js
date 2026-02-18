import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

export const generateTripItinerary = async (destination, startDate, endDate, budget, preferences) => {
  const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 3600 * 24)) + 1;

  // Mock data if no API key is provided
  if (!openai) {
    console.warn("⚠️ OpenAI API Key missing. Returning mock itinerary.");
    return {
      tripName: `Adventure in ${destination}`,
      destination: destination,
      duration: days,
      itinerary: Array.from({ length: days }, (_, i) => ({
        day: i + 1,
        theme: "Exploring the local culture",
        places: [
          {
            name: "Central Park " + destination,
            description: "A beautiful park to relax and enjoy nature.",
            address: "Center of " + destination,
            lat: 22.5726,
            lng: 72.9289,
            recommendedTime: "10:00 AM",
            rating: 4.5
          }
        ]
      }))
    };
  }

  const prompt = `
    Generate a highly detailed and optimized travel itinerary for a ${days}-day trip to ${destination}.
    Budget level: ${budget}.
    Traveler preferences: ${preferences.join(', ')}.
    
    The response MUST be a JSON object with the following structure:
    {
      "tripName": "A descriptive name for the trip",
      "destination": "${destination}",
      "duration": ${days},
      "itinerary": [
        {
          "day": 1,
          "theme": "The theme for this day",
          "places": [
            {
              "name": "Place Name",
              "description": "Short description of what to do there",
              "address": "Full address or location description",
              "lat": 0.0,
              "lng": 0.0,
              "recommendedTime": "e.g. 10:00 AM",
              "rating": 4.5
            }
          ]
        }
      ]
    }
    
    Please ensure the latitude and longitude are accurate for each place. Provide exactly 3-4 interesting places for each day.
    `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Use gpt-3.5-turbo for wider compatibility
      messages: [
        { role: "system", content: "You are a professional travel planner API that returns only JSON itineraries." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("❌ OpenAI API Error:", error);
    throw new Error("Failed to generate trip itinerary from AI. Please check your API key and quota.");
  }
};
