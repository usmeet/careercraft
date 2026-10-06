package com.careercraft.tools;

import com.careercraft.service.GeminiService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class CultureAnalyzer implements CareerTool {

    private final GeminiService geminiService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public CultureAnalyzer(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @Override public String getId() { return "culture-analyzer"; }
    @Override public String getDisplayName() { return "Culture Analyzer"; }

    @Override
    public String run(String input) {
        String systemInstruction = """
            You are a Senior Executive Talent Strategist and Candidate Advocate.
            The user will provide company values, an About Us page snippet, a careers statement, or a job posting.
            Analyze what company culture this signals, what to watch out for, and generate probing "Reverse-Interview" questions for the candidate to ask the hiring team to find out if they truly practice what they preach.
            Return ONLY valid JSON with no markdown wrapping and no backticks.
            JSON structure:
            {
              "culturePersona": "2-3 word headline defining their cultural posture (e.g., 'High-Autonomy Hustle', 'Structured Enterprise', 'Mission-Driven Team')",
              "coreValuesIdentified": ["Value 1", "Value 2", "Value 3"],
              "reverseQuestions": [
                {
                  "valueOrTheme": "Customer Obsession / Work Life Balance / Ownership",
                  "question": "The exact question candidate should ask their interviewer",
                  "whatToListenFor": "Good sign: cites real trade-off decisions; Red sign: vague marketing platitudes"
                }
              ],
              "greenFlags": ["Authentic sign 1", "Positive indicator 2"],
              "subtleRisks": ["Potential risk 1", "Potential risk 2"]
            }
            """;

        try {
            String aiResult = geminiService.generateContent("Company values / Culture snippet:\n" + input, systemInstruction);
            String cleaned = cleanJson(aiResult);
            objectMapper.readTree(cleaned);
            return cleaned;
        } catch (Exception e) {
            System.err.println("Gemini failed in CultureAnalyzer, using deterministic fallback: " + e.getMessage());
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
        Map<String, Object> fallback = new LinkedHashMap<>();
        fallback.put("culturePersona", "Performance & Delivery Oriented");
        fallback.put("coreValuesIdentified", List.of("Speed of Execution", "Ownership & Autonomy", "Collaboration"));
        fallback.put("reverseQuestions", List.of(
            Map.of(
                "valueOrTheme", "Ownership & Decision Making",
                "question", "Can you share a recent example of when an engineer pushed back on a product deadline for technical quality, and how the leadership responded?",
                "whatToListenFor", "Listen for whether engineers have true authority to protect architecture without punitive consequences."
            ),
            Map.of(
                "valueOrTheme", "Work Rhythm & Sustainable Pace",
                "question", "What happens when a project inevitably slips past its sprint target? How does the team handle post-mortems?",
                "whatToListenFor", "Look for blameless learning vs. blaming individuals."
            ),
            Map.of(
                "valueOrTheme", "Career Growth & Mentorship",
                "question", "What does internal mobility look like, and how is proactive learning funded or supported?",
                "whatToListenFor", "Specific allocated time/budget vs. 'we expect people to learn on weekends'."
            )
        ));
        fallback.put("greenFlags", List.of("Direct ownership of deliverables", "Focus on practical outcomes"));
        fallback.put("subtleRisks", List.of("Risk of blurry boundaries if communication expectations aren't clarified upfront"));

        try {
            return objectMapper.writeValueAsString(fallback);
        } catch (Exception ex) {
            return "{}";
        }
    }
}
