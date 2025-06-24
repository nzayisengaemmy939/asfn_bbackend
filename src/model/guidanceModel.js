import mongoose from "mongoose";

const guidanceSchema = new mongoose.Schema({
  guidanceTitle: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  priorityLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  targetAnimals: {
    type: [String],
    required: true,
    default: []
  },
  detailedContent: {
    type: String,
    required: true
  },
  recommendations: {
    type: String
  },
  precautions: {
    type: String
  }
}, { timestamps: true });

const Guidance = mongoose.model('Guidance', guidanceSchema);

export default Guidance;
