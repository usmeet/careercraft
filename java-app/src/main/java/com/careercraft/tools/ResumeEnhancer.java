package com.careercraft.tools;

import com.careercraft.service.GeminiService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class ResumeEnhancer implements CareerTool {

    private final GeminiService geminiService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ResumeEnhancer(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @Override public String getId() { return "resume-enhancer"; }
    @Override public String getDisplayName() { return "Resume Enhancer"; }

    @Override
    public String run(String input) {
        String systemInstruction = """
            You are a Principal Technical Recruiter and Career Coach.
            The user will provide a resume bullet point (or full paragraph).
            Rewrite it into high-impact, XYZ-format resume bullets: Accomplished [X], as measured by [Y], by doing [Z].
            CRITICAL RULE: DO NOT FABRICATE FAKE NUMBERS OR ACHIEVEMENTS. Where a quantifiable metric is needed, use clear placeholders like [X%], [N users], [$Y cost reduction], or [Z ms reduction].
            Return ONLY valid JSON with no markdown wrapping and no backticks.
            JSON structure:
            {
              "original": "The original text provided",
              "actionVerbUsed": "Primary power verb",
              "variants": [
                {
                  "style": "Impact & Metric Focused",
                  "bullet": "Strong action verb + what was built + [placeholder metric] + technical method",
                  "strength": "Why this variant works"
                },
                {
                  "style": "Technical & Architectural Depth",
                  "bullet": "Another variation highlighting technologies and scale with [placeholder metric]",
                  "strength": "Why this variant works"
                },
                {
                  "style": "Leadership & Ownership",
                  "bullet": "A third variation highlighting proactive delivery and team impact",
                  "strength": "Why this variant works"
                }
              ],
              "missingMetricsPrompt": ["Question to ask yourself: How many users/requests were handled?", "What percentage faster did it make the workflow?"]
            }
            """;

        try {
            String aiResult = geminiService.generateContent("Bullet to enhance:\n" + input, systemInstruction);
            String cleaned = cleanJson(aiResult);
            objectMapper.readTree(cleaned);
            return cleaned;
        } catch (Exception e) {
            System.err.println("Gemini failed in ResumeEnhancer, using deterministic fallback: " + e.getMessage());
            return generateFallback(input);
        }
    }

    private String cleanJson(String raw) {
        if (raw == null) return "{}";
        String s = raw.trim();
        if (s.startsWith("```json")) s = s.substring(7);
        else if (s.startsWith("```")) s = s.substring(3);
        if (s.endsWith("```")) s = s.substring(0, s.length() - 3);
        return s.trim();
    }

    private String generateFallback(String input) {
        String trimmed = input.trim();
        Map<String, Object> fallback = new LinkedHashMap<>();
        fallback.put("original", trimmed);
        fallback.put("actionVerbUsed", "Engineered");
        fallback.put("variants", List.of(
            Map.of(
                "style", "Impact & Metric Focused",
                "bullet", "Engineered scalable feature for " + trimmed + ", boosting performance by [X%] and cutting latency by [Y ms].",
                "strength", "Uses Google XYZ formula (Accomplished X, measured by Y, by doing Z)"
            ),
            Map.of(
                "style", "Architecture & Reliability",
                "bullet", "Architected robust workflow for " + trimmed + ", reducing bug reports by [X%] across [N] active users.",
                "strength", "Highlights system reliability and customer focus"
            ),
            Map.of(
                "style", "Ownership & Delivery",
                "bullet", "Spearheaded end-to-end delivery of " + trimmed + ", accelerating deployment cycles by [X weeks].",
                "strength", "Emphasizes initiative and execution speed"
            )
        ));
        fallback.put("missingMetricsPrompt", List.of(
            "What was the measurable before vs. after outcome (e.g. load time, revenue, user signups)?",
            "What specific tools or frameworks did you leverage?"
        ));

        try {
            return objectMapper.writeValueAsString(fallback);
        } catch (Exception ex) {
            return "{}";
        }
    }
}
