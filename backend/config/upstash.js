import { Redis } from "@upstash/redis";
import { RateLimit } from "@upstash/ratelimit";

import "dotenv/config";
const rateLimit = new RateLimit({
  redis: Redis.fromENV(),
  limiter: RateLimit.slidingWindow(100, "60 s"),
});

export default rateLimit;
