import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export async function checkRateLimit(identifier: string) {
    // Falls back to in-memory if env vars are missing (for dev/build safety)
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
        console.warn("Upstash Redis credentials not found. Rate limiting is DISABLED.");
        return { ok: true };
    }

    const ratelimit = new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(20, "1 h"), // 20 requests per hour
        analytics: true,
        prefix: "@upstash/ratelimit",
    });

    const { success } = await ratelimit.limit(identifier);
    
    return { ok: success };
}
