import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const SessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    title: {
      type: String,
      default: "Untitled research thread"
    },
    context: {
      disease: String,
      query: String,
      location: String,
      age: Number,
      gender: String,
      treatment: String
    },
    messages: {
      type: [MessageSchema],
      default: []
    },
    lastRetrievedAt: Date
  },
  { timestamps: true }
);

export const Session = mongoose.model("Session", SessionSchema);
