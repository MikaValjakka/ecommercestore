import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export const redis = new Redis(process.env.UPSTASH_REDIS_URL);

export const closeRedis = async () => {
  await redis.quit(); // Graceful close the Redis connection
};
