package com.careercraft.service;

import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

/**
 * Tracks guest usage via HTTP session to enforce the free-try limit.
 */
@Service
public class GuestLimitService {

    private static final String KEY = "guest_uses";
    private static final int LIMIT = 3;

    public boolean hasReachedLimit(HttpSession session) {
        Integer uses = (Integer) session.getAttribute(KEY);
        return uses != null && uses >= LIMIT;
    }

    public void increment(HttpSession session) {
        Integer uses = (Integer) session.getAttribute(KEY);
        session.setAttribute(KEY, (uses == null ? 0 : uses) + 1);
    }

    public int remaining(HttpSession session) {
        Integer uses = (Integer) session.getAttribute(KEY);
        return Math.max(0, LIMIT - (uses == null ? 0 : uses));
    }
}
