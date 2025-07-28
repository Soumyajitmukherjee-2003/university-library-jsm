import { Ratelimit } from "@upstash/ratelimit";
import redis from "@/database/redis"; 

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10 s"), 
  analytics: true,
});
