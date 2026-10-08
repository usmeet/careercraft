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
        } catch (HttpStatusCodeException e) {
            // e.g. 400 "resume_text is too short" from FastAPI: pass its message through
            return error(extractDetail(e.getResponseBodyAsString(), "The ML service rejected the request."));
        } catch (RestClientException e) {
            return error("ML service unavailable. Start it with: uvicorn api:app --port 8000");
        }
    }

    private String extractDetail(String body, String fallback) {
        try {
            JsonNode detail = mapper.readTree(body).get("detail");
            return (detail != null && detail.isTextual()) ? detail.asText() : fallback;
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
