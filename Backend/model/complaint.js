const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter a complaint title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please enter a complaint description"],
      trim: true,
    },
    category: {
      type: String,
      default: "general",
      trim: true,
    },
    status: {
      type: String,
      enum: ["open", "under_review", "resolved", "rejected"],
      default: "open",
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    orderId: {
      type: String,
    },
    shopId: {
      type: String,
    },
    createdBy: {
      type: Object,
      required: true,
    },
    resolutionNote: {
      type: String,
    },
    reviewedBy: {
      type: Object,
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Complaint", complaintSchema);