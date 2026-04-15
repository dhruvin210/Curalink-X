import crypto from "crypto";
import { CacheEntry } from "../../models/cache-entry.model.js";
import { env } from "../../config/env.js";

const toFingerprint = (payload) =>
  crypto.createHash("sha256").update(JSON.stringify(payload)).digest("hex");

export class ResearchCacheService {
  buildKey(payload) {
    return toFingerprint(payload);
  }

  async get(payload) {
    const key = this.buildKey(payload);
    return CacheEntry.findOne({
      key,
      expiresAt: { $gt: new Date() }
    }).lean();
  }

  async set(payload, result) {
    const key = this.buildKey(payload);
    const expiresAt = new Date(
      Date.now() + env.cacheTtlHours * 60 * 60 * 1000
    );

    return CacheEntry.findOneAndUpdate(
      { key },
      {
        key,
        requestFingerprint: key,
        payload: result,
        expiresAt
      },
      { upsert: true, new: true }
    );
  }
}

export const researchCacheService = new ResearchCacheService();
