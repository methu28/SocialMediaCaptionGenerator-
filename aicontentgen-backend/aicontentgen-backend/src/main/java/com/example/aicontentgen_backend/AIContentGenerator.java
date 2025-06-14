package com.example.aicontentgen_backend;

import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Base64;

import com.google.genai.Client;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.Part;

public class AIContentGenerator {

	 private final Client client;

	    public AIContentGenerator(String apiKey) {
	        // Initialize client using Gemini Developer API
	        this.client = Client.builder()
	                            .apiKey(apiKey)
	                            .build();
	    }

	    public String generateContent(String prompt, String tone, String length, String format) {
	        String enhancedPrompt = String.format(
	            "%s Write in a %s tone, about %s length, formatted as %s.",
	            prompt, tone, length, format
	        );

	        Content content = Content.fromParts(
	            Part.fromText(enhancedPrompt)
	        );

	        GenerateContentResponse response = client.models.generateContent(
	            "gemini-2.0-flash-001", content, null
	        );

	        return response.text();
	    }
   
}

