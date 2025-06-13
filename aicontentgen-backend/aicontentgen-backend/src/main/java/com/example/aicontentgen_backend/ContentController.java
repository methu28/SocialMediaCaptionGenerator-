package com.example.aicontentgen_backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173") // Adjust if needed
public class ContentController {

    private final AIContentGenerator contentGenerator;

    // Here we inject the API key from application.properties or environment variable
    public ContentController(@Value("${gemini.api.key}") String geminiApiKey) {
        this.contentGenerator = new AIContentGenerator(geminiApiKey);
    }

    @PostMapping("/generate")
    public ResponseEntity<String> generateText(@RequestBody TextRequest request) {
        // Build enhanced prompt
        String enrichedPrompt = String.format("""
            Create a %s %s %s for the %s platform.

            Brand voice: %s.
            Audience: %s.
            Optimize for these SEO keywords: %s.
            Add relevant hashtags and emojis.

            Original prompt: %s
            """,
            request.getTone(), 
            request.getLength(), 
            request.getFormat(), 
            request.getPlatform(), 
            request.getBrandVoice(), 
            request.getAudience(), 
            request.getSeoKeywords(), 
            request.getPrompt()
        );

        String result = contentGenerator.generateContent(
            enrichedPrompt,
            request.getTone(), 
            request.getLength(), 
            request.getFormat()
        );

        return ResponseEntity.ok(result);
    }

    @PostMapping("/suggest")
    public ResponseEntity<String> suggestEnhancements(@RequestBody Map<String, String> request) {
        String originalText = request.get("text");

        String suggestionPrompt = "Suggest useful enhancements or additions to the following content:\n\n" + originalText;

        String suggestion = contentGenerator.generateContent(suggestionPrompt, "neutral", "medium", "paragraph");

        return ResponseEntity.ok(suggestion);
    }
}



