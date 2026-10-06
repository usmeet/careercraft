package com.careercraft.tools;

import com.careercraft.service.GeminiService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class JdDecoder implements CareerTool {

    private final GeminiService geminiService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public JdDecoder(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @Override public String getId() { return "jd-decoder"; }
    @Override public String getDisplayName() { return "JD Decoder"; }

    @Override
    public String run(String input) {
        String systemInstruction = """
            You are an elite Tech Recruiter & Job Search Strategist.
            Analyze the job description provided by the user.
            You MUST return ONLY valid JSON with no markdown wrapping, no backticks, no code blocks.
            Follow this exact JSON structure:
            {
              "verdict": "Short 1-2 sentence recommendation on whether and why to apply",
              "mustHaveSkills": ["Skill 1", "Skill 2", ...],
              "niceToHaveSkills": ["Skill 1", "Skill 2", ...],
              "redFlags": [
                {
                  "phrase": "Exact quoted phrase from text",
                  "explanation": "Why this is a warning sign for candidates"
                }
              ],
              "experienceLevel": "Entry / Mid / Senior estimated level",
              "quickSummary": "2-sentence plain English summary of what the role actually does"
            }
            """;

        try {
            String aiResult = geminiService.generateContent("Job Description:\n" + input, systemInstruction);
            // Clean up any stray markdown formatting if Gemini wrapped it
            String cleaned = cleanJson(aiResult);
            // Verify valid JSON
            objectMapper.readTree(cleaned);
            return cleaned;
        } catch (Exception e) {
            System.err.println("Gemini failed in JdDecoder, using deterministic fallback: " + e.getMessage());
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
        String lower = input.toLowerCase();
        List<String> detected = new ArrayList<>();
        List<String> techKeywords = List.of("python", "java", "javascript", "react", "spring", "docker", "aws", "sql", "rest", "api", "kubernetes", "cloud");
        for (String kw : techKeywords) {
            if (lower.contains(kw)) {
                detected.add(kw.substring(0, 1).toUpperCase() + kw.substring(1));
            }
        }
        if (detected.isEmpty()) detected.add("General Software Engineering");

        List<Map<String, String>> redFlags = new ArrayList<>();
        if (lower.contains("fast-paced") || lower.contains("fast paced")) {
            redFlags.add(Map.of("phrase", "Fast-paced environment", "explanation", "May indicate high pressure, urgent firefighting, or lean staffing."));
        }
        if (lower.contains("rockstar") || lower.contains("ninja")) {
            redFlags.add(Map.of("phrase", "Rockstar / Ninja", "explanation", "Unclear job scope; often expects 3 roles for the price of 1."));
        }
        if (lower.contains("wear many hats")) {
            redFlags.add(Map.of("phrase", "Wear many hats", "explanation", "Fluid responsibilities with potential scope creep."));
        }

        Map<String, Object> fallbackMap = new LinkedHashMap<>();
        fallbackMap.put("verdict", "Good candidate match. Compare the must-have technologies with your past projects before applying.");
        fallbackMap.put("mustHaveSkills", detected);
        fallbackMap.put("niceToHaveSkills", List.of("CI/CD Automation", "Unit Testing & QA", "Agile Collaboration"));
        fallbackMap.put("redFlags", redFlags);
        fallbackMap.put("experienceLevel", lower.contains("senior") ? "Senior" : (lower.contains("fresher") || lower.contains("junior") ? "Entry Level" : "Mid Level"));
        fallbackMap.put("quickSummary", "Role focused on software engineering and systems development with emphasis on modern tooling.");

        try {
            return objectMapper.writeValueAsString(fallbackMap);
        } catch (Exception ex) {
            return "{}";
        }
    }
}
