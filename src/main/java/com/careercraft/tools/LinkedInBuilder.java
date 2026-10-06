package com.careercraft.tools;

import com.careercraft.service.GeminiService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class LinkedInBuilder implements CareerTool {

    private final GeminiService geminiService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public LinkedInBuilder(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @Override public String getId() { return "linkedin-builder"; }
    @Override public String getDisplayName() { return "LinkedIn Builder"; }

    @Override
    public String run(String input) {
        String systemInstruction = """
            You are a LinkedIn SEO & Executive Branding Expert.
            The user will provide their background and target role/industry.
            Generate high-converting, recruiter-friendly LinkedIn headlines and searchable keywords.
            Return ONLY valid JSON with no markdown wrapping and no backticks.
            JSON structure:
            {
              "headlines": [
                {
                  "angle": "Recruiter Search Focused (Keywords)",
                  "text": "Target Role | Core Tech Stack | Measurable Value or Passion"
                },
                {
                  "angle": "Value Proposition & Outcome Focused",
                  "text": "Helping [Target Audience] Achieve [Outcome] using [Specialty]"
                },
                {
                  "angle": "Early Career / Student Transition",
                  "text": "Aspiring [Role] | [Specialization] | Open to Impactful Opportunities"
                },
                {
                  "angle": "Creative & Differentiated",
                  "text": "A punchy, memorable headline under 120 characters"
                }
              ],
              "seoKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
              "aboutSectionHook": "An engaging 2-sentence opening hook for their LinkedIn About section",
              "proTip": "Actionable tip on how to optimize featured items or search rankings"
            }
            """;

        try {
            String aiResult = geminiService.generateContent("Background & Target Role:\n" + input, systemInstruction);
            String cleaned = cleanJson(aiResult);
            objectMapper.readTree(cleaned);
            return cleaned;
        } catch (Exception e) {
            System.err.println("Gemini failed in LinkedInBuilder, using deterministic fallback: " + e.getMessage());
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
        fallback.put("headlines", List.of(
            Map.of("angle", "Recruiter Search Focused", "text", trimmed + " | Python, Java, Cloud Architecture | Building Scalable Systems"),
            Map.of("angle", "Value Proposition", "text", "Software Engineer | Delivering Robust APIs & Scalable Backend Architectures"),
            Map.of("angle", "Opportunity Driven", "text", trimmed + " Specialist | Passionate about Distributed Systems | Open to New Roles"),
            Map.of("angle", "Impact Focused", "text", "Building clean software solutions with modern tech stacks | " + trimmed)
        ));
        fallback.put("seoKeywords", List.of("Software Engineering", "Backend Development", "REST APIs", "Cloud Computing", "System Design"));
        fallback.put("aboutSectionHook", "I turn complex problems into clean, testable software solutions that scale effortlessly.");
        fallback.put("proTip", "Always include your top 3 technologies in the first 60 characters so mobile LinkedIn search doesn't cut them off.");

        try {
            return objectMapper.writeValueAsString(fallback);
        } catch (Exception ex) {
            return "{}";
        }
    }
}
