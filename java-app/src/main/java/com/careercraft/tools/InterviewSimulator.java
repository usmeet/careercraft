package com.careercraft.tools;

import com.careercraft.service.GeminiService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class InterviewSimulator implements CareerTool {

    private final GeminiService geminiService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public InterviewSimulator(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @Override public String getId() { return "interview-simulator"; }
    @Override public String getDisplayName() { return "Interview Simulator"; }

    @Override
    public String run(String input) {
        // If input contains "[ANSWER]", it is an interactive answer evaluation!
        if (input.contains("[ANSWER]")) {
            return evaluateAnswer(input);
        }

        String systemInstruction = """
            You are a Principal Engineering Hiring Manager at a premier tech firm.
            The user will provide a target job role, tech stack, or JD.
            Generate an interactive interview set categorized by rounds (Behavioral, Technical, Scenario/Case).
            Return ONLY valid JSON with no markdown wrapping and no backticks.
            JSON structure:
            {
              "role": "Target role name",
              "interviewQuestions": [
                {
                  "id": 1,
                  "round": "Behavioral (STAR Method)",
                  "question": "Realistic behavioral question testing collaboration or conflict",
                  "hint": "What hiring managers look for in the STAR response"
                },
                {
                  "id": 2,
                  "round": "Technical Deep Dive",
                  "question": "Deep technical question related to core language or architecture",
                  "hint": "Focus on trade-offs, performance, and failure modes"
                },
                {
                  "id": 3,
                  "round": "System Scenario & Debugging",
                  "question": "A production incident or design scenario question",
                  "hint": "Break down into diagnosis, containment, and long-term resolution"
                }
              ],
              "preparationTip": "Key mindset advice for this interview"
            }
            """;

        try {
            String aiResult = geminiService.generateContent("Role / JD:\n" + input, systemInstruction);
            String cleaned = cleanJson(aiResult);
            objectMapper.readTree(cleaned);
            return cleaned;
        } catch (Exception e) {
            System.err.println("Gemini failed in InterviewSimulator, using deterministic fallback: " + e.getMessage());
            return generateFallbackQuestions(input);
        }
    }

    private String evaluateAnswer(String input) {
        String systemInstruction = """
            You are a hiring manager providing constructive, candid interview coaching.
            The user will provide an interview question and their typed response in the format:
            [QUESTION] ... [ANSWER] ...
            Evaluate the answer using the STAR framework.
            Return ONLY valid JSON with no markdown wrapping and no backticks.
            JSON structure:
            {
              "score": "Strong Hire / Hire / Weak Hire",
              "strengths": ["Clear structure", "Good technical detail"],
              "areasToImprove": ["Add quantifiable metrics", "Clarify your individual contribution vs the team"],
              "improvedAnswerSample": "A rewritten 3-sentence version of their answer showing how to elevate it",
              "followUpQuestion": "A tough follow-up question the interviewer would ask next"
            }
            """;

        try {
            String aiResult = geminiService.generateContent(input, systemInstruction);
            String cleaned = cleanJson(aiResult);
            objectMapper.readTree(cleaned);
            return cleaned;
        } catch (Exception e) {
            Map<String, Object> fallback = Map.of(
                "score", "Promising Answer",
                "strengths", List.of("Direct answer to the prompt", "Clear technical context"),
                "areasToImprove", List.of("Quantify the final outcome using measurable numbers (XYZ formula)", "Explicitly state what YOU did vs what your team did"),
                "improvedAnswerSample", "I identified that [problem was occurring], implemented [specific solution with tech], which improved [metric] by [X%] and unblocked [team].",
                "followUpQuestion", "If that solution had failed under 10x traffic, what would have been your backup plan?"
            );
            try { return objectMapper.writeValueAsString(fallback); } catch (Exception ex) { return "{}"; }
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

    private String generateFallbackQuestions(String input) {
        String role = input.trim().isEmpty() ? "Software Engineer" : input.trim();
        Map<String, Object> fallback = new LinkedHashMap<>();
        fallback.put("role", role);
        fallback.put("interviewQuestions", List.of(
            Map.of(
                "id", 1,
                "round", "Behavioral (STAR Method)",
                "question", "Tell me about a time you faced an ambiguous technical requirement with a tight deadline. How did you decide what to build?",
                "hint", "Focus on how you communicated with stakeholders and chose pragmatic trade-offs."
            ),
            Map.of(
                "id", 2,
                "round", "Technical Deep Dive",
                "question", "Explain the difference between optimistic and pessimistic locking in databases. In what scenario would you choose each?",
                "hint", "Discuss throughput impact and conflict frequency."
            ),
            Map.of(
                "id", 3,
                "round", "System Scenario & Debugging",
                "question", "Your microservice is experiencing intermittent 504 gateway timeouts under peak traffic. Walk me through your step-by-step triage process.",
                "hint", "Check logs, metrics, connection pools, external dependencies, and thread dumps."
            )
        ));
        fallback.put("preparationTip", "Structure your behavioral answers with 1 sentence for Situation, 1 for Task, 2 for your specific Action, and 1 for measurable Result.");

        try {
            return objectMapper.writeValueAsString(fallback);
        } catch (Exception ex) {
            return "{}";
        }
    }
}
