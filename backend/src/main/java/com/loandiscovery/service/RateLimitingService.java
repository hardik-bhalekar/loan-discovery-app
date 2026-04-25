package com.loandiscovery.service;

import java.time.Duration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class RateLimitingService {

    private final RedisTemplate<String, String> redisTemplate;

    public RateLimitingService(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    /**
     * Checks if the given key has exceeded the maximum allowed requests within the time window.
     * Returns true if allowed, false if limit exceeded.
     */
    public boolean allowRequest(String key, int maxRequests, Duration window) {
        String redisKey = "rate_limit:" + key;
        Long currentCount = redisTemplate.opsForValue().increment(redisKey);
        
        if (currentCount != null && currentCount == 1) {
            // First request, set expiration
            redisTemplate.expire(redisKey, window);
        }
        
        return currentCount != null && currentCount <= maxRequests;
    }
}
