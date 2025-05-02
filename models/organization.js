import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema({
name: {
type: String,
required: true},


location: {
type: String,
enum:['point'],
required: true},

coordinates : {
type: [Number],     
required: true}

});

organizationSchema.index({ location: "2dsphere" });

export default mongoose.model("Organization", organizationSchema);