// models/Attendance.js
import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true
  },
  checkIn: { type: Date },
  checkOut: { type: Date },
  location: {
    type: {
      type: String,
      enum: ["Point"]
    },
    coordinates: [Number] // [longitude, latitude]
  },
  duration: Number // in minutes
});

export default mongoose.model("Attendance", attendanceSchema);
