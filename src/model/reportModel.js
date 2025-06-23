import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    senderRole: {
      type: String,
      enum: ["authority", "farmer", "veterinarian"],
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const asfReportSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["pending", "received", "resolved"],
      default: "pending",
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    sector: {
      type: String,
      required: true,
      trim: true,
    },
    cell: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: Number,
      // required: true,
      trim: true,
    },
    symptoms: {
      type: String,
      required: true,
      trim: true,
    },
    numberOfPigsAffected: {
      type: Number,
      min: 1,
    },
    pigsDied: {
      type: Number,
      min: 0,
    },
     pigsRecovered: {
      type: Number,
      min: 0,
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    senderRole: {
      type: String,
      required: true,
      min: 1,
    },
    replies: [replySchema],
    assignedTo: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const ASFReport = mongoose.model("ASFReport", asfReportSchema);
export default ASFReport;
