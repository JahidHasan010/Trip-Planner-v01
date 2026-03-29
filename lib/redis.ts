import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function getCachedItinerary(key: string) {
  try {
    return await redis.get(key);
  } catch (err) {
    console.error('❌ Redis Get Error:', err);
    return null;
  }
}

export async function setCachedItinerary(key: string, value: any) {
  try {
    // Cache for 24 hours (86400 seconds)
    await redis.set(key, value, { ex: 86400 });
  } catch (err) {
    console.error('❌ Redis Set Error:', err);
  }
}

export function generateCacheKey(data: any) {
  const { destination, budget, travelers, interests } = data;
  return `itinerary:${destination}:${budget}:${travelers}:${interests}`.toLowerCase().replace(/\s+/g, '-');
}
