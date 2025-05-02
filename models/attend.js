
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
    coordinates: [Number] 
  },
  duration: Number 
});

export default mongoose.model("Attendance", attendanceSchema);
