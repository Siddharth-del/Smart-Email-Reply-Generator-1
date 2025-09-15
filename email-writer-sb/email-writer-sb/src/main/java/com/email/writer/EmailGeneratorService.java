package com.email.writer;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class EmailGeneratorService {

    private final WebClient webClient;
    private final String apiKey;

    public EmailGeneratorService(WebClient.Builder webClientBuilder,
                                 @Value("${gemini.api.url}") String baseUrl,
                                 @Value("${gemini.api.key}") String geminiApiKey) {
        this.apiKey = geminiApiKey;
        this.webClient = webClientBuilder.baseUrl(baseUrl).build();
    }

    public String generateEmailReply(EmailRequest emailRequest) throws JsonProcessingException {
        // Build prompt
        String prompt = buildPrompt(emailRequest);

        // Prepare request body safely
        String requestBody = String.format("""
            {
              "contents": [
                {
                  "parts": [
                    {
                      "text": "%s"
                    }
                  ]
                }
              ]
            }
            """, prompt.replace("\"", "\\\""));

        // Send API request
        String response = webClient.post()
                .uri("/v1beta/models/gemini-2.5-flash:generateContent")
                .header("x-goog-api-key", apiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        // Extract response safely
        return extractResponseContent(response);
    }
private String extractResponseContent(String response) throws JsonProcessingException {
    ObjectMapper mapper = new ObjectMapper();
    JsonNode root = mapper.readTree(response);

    JsonNode candidates = root.path("candidates");
    if (candidates.isArray() && candidates.size() > 0) {
        JsonNode parts = candidates.get(0).path("content").path("parts");
        if (parts.isArray() && parts.size() > 0) {
            JsonNode textNode = parts.get(0).path("text");
            if (textNode.isTextual()) {
                return textNode.asText();
            }
        }
    }
    return "No response generated"; 
}



    private String buildPrompt(EmailRequest emailRequest) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Generate a professional email reply for the following email. ");
        if (emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()) {
            prompt.append("Use a ").append(emailRequest.getTone()).append(" tone. ");
        }
        prompt.append("Original Email:\n").append(emailRequest.getEmailContent());
        return prompt.toString();
    }
}
