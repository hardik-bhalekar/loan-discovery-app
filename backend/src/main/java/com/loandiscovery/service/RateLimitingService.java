package com.loandiscovery.service;

import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class RateLimitingService {

    private record LocalWindowCounter(Instant expiresAt, AtomicLong count) {
    }

    private final RedisTemplate<String, String> redisTemplate;
    private final ConcurrentHashMap<String, LocalWindowCounter> localCounters = new ConcurrentHashMap<>();

    public RateLimitingService(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    /**
     * Checks if the given key has exceeded the maximum allowed requests within the time window.
     * Returns true if allowed, false if limit exceeded.
     */
    public boolean allowRequest(String key, int maxRequests, Duration window) {
        try {
            return allowWithRedis(key, maxRequests, window);
        } catch (Exception ex) {
            return allowWithLocalFallback(key, maxRequests, window);
        }
    }

    private boolean allowWithRedis(String key, int maxRequests, Duration window) {
        String redisKey = "rate_limit:" + key;
        Long currentCount = redisTemplate.opsForValue().increment(redisKey);

        if (currentCount != null && currentCount == 1) {
            redisTemplate.expire(redisKey, window);
        }

        return currentCount != null && currentCount <= maxRequests;
    }

    private boolean allowWithLocalFallback(String key, int maxRequests, Duration window) {
        Instant now = Instant.now();
        LocalWindowCounter counter = localCounters.compute(key, (k, existing) -> {
            if (existing == null || now.isAfter(existing.expiresAt())) {
                return new LocalWindowCounter(now.plus(window), new AtomicLong(1));
            }
            existing.count().incrementAndGet();
            return existing;
        });

        return counter.count().get() <= maxRequests;
    }
}
