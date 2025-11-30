import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import "dotenv/config";

// Initialize Redis client from environment variables
const redis = Redis.fromEnv();

// Set up rate limiter
const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "60s"), //Will add based on user IDs
});

export default rateLimit;
