import mongoose from "mongoose";

const TripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  tripName: { type: String },
  destination: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  budget: { type: String, required: true },
  preferences: [{ type: String }],
  itinerary: [
    {
      day: Number,
      theme: String,
      places: [
        {
          name: String,
          description: String,
          address: String,
          lat: Number,
          lng: Number,
          recommendedTime: String,
          rating: Number,
          photo: String // Optional URL for images
        },
      ],
    },
  ],
  coverImage: { type: String, default: "" },
  status: { type: String, enum: ["upcoming", "completed", "draft"], default: "upcoming" },
  weatherData: { type: Object, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Trip = mongoose.model("Trip", TripSchema);
export default Trip;
