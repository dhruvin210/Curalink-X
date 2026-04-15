import mongoose from "mongoose";

const CacheEntrySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    requestFingerprint: {
      type: String,
      required: true
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    expiresAt: {
      type: Date,
      required: true,
      index: {
        expires: 0
      }
    }
  },
  { timestamps: true }
);

export const CacheEntry = mongoose.model("CacheEntry", CacheEntrySchema);
