package com.example.aicontentgen_backend;

public class TextRequest {
    private String prompt;
    private String tone;
    private String length;
    private String format;

    // New fields
    private String platform;
    private String brandVoice;
    private String audience;
    private String seoKeywords;

    // Getters and Setters
    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }

    public String getTone() { return tone; }
    public void setTone(String tone) { this.tone = tone; }

    public String getLength() { return length; }
    public void setLength(String length) { this.length = length; }

    public String getFormat() { return format; }
    public void setFormat(String format) { this.format = format; }

    public String getPlatform() { return platform; }
    public void setPlatform(String platform) { this.platform = platform; }

    public String getBrandVoice() { return brandVoice; }
    public void setBrandVoice(String brandVoice) { this.brandVoice = brandVoice; }

    public String getAudience() { return audience; }
    public void setAudience(String audience) { this.audience = audience; }

    public String getSeoKeywords() { return seoKeywords; }
    public void setSeoKeywords(String seoKeywords) { this.seoKeywords = seoKeywords; }
}
