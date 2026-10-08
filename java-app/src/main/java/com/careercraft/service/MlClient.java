package com.careercraft.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.Map;

/** Calls the Python ML service (FastAPI). Always returns a JSON string, like the other tools. */
@Service
public class MlClient {

    private final RestClient client;
    private final ObjectMapper mapper = new ObjectMapper();

    public MlClient(@Value("${ml.service.url:http://localhost:8000}") String baseUrl) {
        this.client = RestClient.create(baseUrl);
    }

    public String match(String resume, String jobDescription) {
        try {
            return client.post().uri("/match")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("resume_text", resume, "job_description", jobDescription))
                    .retrieve()
                    .body(String.class);
        } catch (org.springframework.web.client.RestClientResponseException e) {
            String detail = extractDetail(e.getResponseBodyAsString(),
                    "The ML service returned HTTP " + e.getStatusCode().value() + ". Please provide more resume and job details.");
            return error(detail);
        } catch (RestClientException e) {
            return error("ML service unavailable. Start it with: python -m uvicorn api:app --port 8000");
        }
    }

    private String extractDetail(String body, String fallback) {
        if (body == null || body.trim().isEmpty()) {
            return fallback;
        }
        try {
            JsonNode node = mapper.readTree(body);
            JsonNode detail = node.get("detail");
            if (detail != null) {
                if (detail.isTextual()) {
                    return detail.asText();
                } else if (detail.isArray() && detail.size() > 0) {
                    JsonNode first = detail.get(0);
                    if (first.has("msg")) {
                        return first.get("msg").asText();
                    }
                    return detail.toString();
                }
            }
            return fallback;
        } catch (Exception ignored) {
            return fallback;
        }
    }

    private String error(String message) {
        try {
            return mapper.writeValueAsString(Map.of("error", message));
        } catch (Exception e) {
            return "{\"error\":\"Unexpected error\"}";
        }
    }
}
