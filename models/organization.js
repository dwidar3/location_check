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
        type: [Number], 
        required: true,
      },
    },
    employees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
      }],
  });
  
  organizationSchema.index({ location: "2dsphere" }); 
  

export default mongoose.model("Organization", organizationSchema);
