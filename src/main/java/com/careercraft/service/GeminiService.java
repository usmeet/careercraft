package com.careercraft.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    private final String apiKey;
    private final String apiUrl;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public GeminiService(@Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent}") String apiUrl,
                         @Value("${gemini.api.key:${GEMINI_API_KEY:}}") String apiKey) {
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
    }

    public String generateContent(String userInput, String systemInstruction) {
        Map<String, Object> requestBody = Map.of(
            "systemInstruction", Map.of(
                "parts", List.of(Map.of("text", systemInstruction))
            ),
            "contents", List.of(
                Map.of("parts", List.of(Map.of("text", userInput)))
            ),
            "generationConfig", Map.of("temperature", 0.7)
        );

        try {
            String json = objectMapper.writeValueAsString(requestBody);
            String fullUrl = apiUrl + "?key=" + apiKey;
            java.net.http.HttpRequest.Builder reqBuilder = java.net.http.HttpRequest.newBuilder()
                    .header("Content-Type", "application/json")
                    .header("x-goog-api-key", apiKey);

            // Use plain Java HttpClient — no Spring WebClient URL encoding issues
            java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
            java.net.http.HttpRequest request = reqBuilder
                    .uri(URI.create(fullUrl))
                    .POST(java.net.http.HttpRequest.BodyPublishers.ofString(json))
                    .build();

            java.net.http.HttpResponse<String> httpResponse =
                    client.send(request, java.net.http.HttpResponse.BodyHandlers.ofString());

            if (httpResponse.statusCode() != 200) {
                System.err.println("Gemini API error " + httpResponse.statusCode() + ": " + httpResponse.body());
                throw new RuntimeException("Gemini API returned HTTP " + httpResponse.statusCode() + ": " + httpResponse.body());
            }

            Map<?, ?> responseMap = objectMapper.readValue(httpResponse.body(), Map.class);
            return extractTextFromResponse(responseMap);

        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to generate content from Gemini API: " + e.getMessage());
        }
    }

    private String extractTextFromResponse(Map<?, ?> response) {
        try {
            List<?> candidates = (List<?>) response.get("candidates");
            if (candidates == null || candidates.isEmpty()) return "No response from AI.";
            Map<?, ?> firstCandidate = (Map<?, ?>) candidates.get(0);
            Map<?, ?> content = (Map<?, ?>) firstCandidate.get("content");
            List<?> parts = (List<?>) content.get("parts");
            Map<?, ?> firstPart = (Map<?, ?>) parts.get(0);
            return (String) firstPart.get("text");
        } catch (Exception e) {
            System.err.println("Error parsing Gemini response: " + response);
            return "Error parsing response from AI.";
        }
    }
}
