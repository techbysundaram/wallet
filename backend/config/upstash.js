import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import "dotenv/config";

// Initialize Redis client from environment variables
const redis = Redis.fromEnv();

// Set up rate limiter
const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(2, "60s"), // 2 requests per 60 seconds
});

export default rateLimit;
