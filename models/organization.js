import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    employees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
      }],
  });
  
  organizationSchema.index({ location: "2dsphere" }); // ضروري لدعم الاستعلامات الجغرافية
  

export default mongoose.model("Organization", organizationSchema);