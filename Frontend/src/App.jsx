import React, { useState } from "react";

function App() {
  const [prompt, setPrompt] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [brandVoice, setBrandVoice] = useState("neutral");
  const [audience, setAudience] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [tone, setTone] = useState("neutral");
  const [length, setLength] = useState("medium");
  const [format, setFormat] = useState("paragraph");
  const [generatedText, setGeneratedText] = useState("");
  const [suggestedText, setSuggestedText] = useState("");

  // Image analysis states
  const [imageCaption, setImageCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleGenerateText = async () => {
    try {
      const response = await fetch("https://socialmediacaptiongenerator-boot.onrender.com/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, platform, brandVoice, audience, seoKeywords, tone, length, format })
      });

      if (!response.ok) throw new Error(`HTTP error! ${response.status}`);

      const data = await response.text();
      setGeneratedText(data);
      setSuggestedText("");
    } catch (error) {
      console.error("Error generating content:", error);
      setGeneratedText("Failed to generate content.");
    }
  };

  const handleSuggestEnhancements = async () => {
    try {
      const response = await fetch("https://socialmediacaptiongenerator-boot.onrender.com/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: generatedText })
      });

      if (!response.ok) throw new Error(`HTTP error! ${response.status}`);

      const suggestion = await response.text();
      setSuggestedText(suggestion);
    } catch (error) {
      console.error("Error getting suggestions:", error);
      setSuggestedText("Failed to get suggestions.");
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);  // <-- key must match backend

    try {
      const response = await fetch("https://socialmediacaptiongenerator-flask.onrender.com/analyze", {
        method: "POST",
        body: formData,
        mode: "cors",
      });

      if (!response.ok) throw new Error(`HTTP error! ${response.status}`);

      const data = await response.json();
      setImageCaption(data.caption);
    } catch (error) {
      console.error("Error uploading image:", error);
      setImageCaption("Failed to analyze image.");
    }
  };


  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>AI Caption Generator</h1>

      <section style={{ marginBottom: "2rem" }}>
        <h2>Generate Text</h2>

        <textarea
          placeholder="Enter prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{ width: "100%", padding: "0.5rem", height: "100px", marginBottom: "1rem" }}
        />

        <div>
          <label>
            Platform:
            <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="x">X (Twitter)</option>
              <option value="threads">Threads</option>
              <option value="pinterest">Pinterest</option>
            </select>
          </label>
        </div>

        <div>
          <label>
            Brand Voice:
            <input
              type="text"
              placeholder="e.g., friendly, professional"
              value={brandVoice}
              onChange={(e) => setBrandVoice(e.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            Audience Description:
            <input
              type="text"
              placeholder="e.g., young adults interested in fitness"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            SEO Keywords:
            <input
              type="text"
              placeholder="Comma separated keywords"
              value={seoKeywords}
              onChange={(e) => setSeoKeywords(e.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            Tone:
            <select value={tone} onChange={(e) => setTone(e.target.value)}>
              <option value="neutral">Neutral</option>
              <option value="professional">Professional</option>
              <option value="funny">Funny</option>
            </select>
          </label>

          <label>
            Length:
            <select value={length} onChange={(e) => setLength(e.target.value)}>
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>
          </label>

          <label>
            Format:
            <select value={format} onChange={(e) => setFormat(e.target.value)}>
              <option value="paragraph">Paragraph</option>
              <option value="bullet points">Bullet Points</option>
              <option value="tweet">Tweet</option>
            </select>
          </label>
        </div>

        <button style={{ marginTop: "1rem" }} onClick={handleGenerateText}>
          Generate Text
        </button>

        {generatedText && (
          <>
            <h3 style={{ marginTop: "2rem" }}>Generated Content</h3>
            <div
              style={{ whiteSpace: "pre-wrap", border: "1px solid #ccc", padding: "1rem" }}
            >
              {generatedText}
            </div>

            <button style={{ marginTop: "1rem" }} onClick={handleSuggestEnhancements}>
              Suggest Enhancements
            </button>

            {suggestedText && (
              <>
                <h3 style={{ marginTop: "1rem" }}>Suggested Improvements</h3>
                <div
                   style={{ whiteSpace: "pre-wrap", border: "1px solid #ccc", padding: "1rem" }}
                 >
                   {suggestedText}
                 </div>
               </>
            )}

          </>
        )}

      </section>

      {/* Image Upload Section */}
      <section style={{ marginTop: "3rem" }}>
        <h2>Upload an Image to Generate Caption <span style={{ fontSize: '0.7em' }}> (better with faces)</span></h2>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
        <button style={{ marginTop: "1rem" }} onClick={handleImageUpload}>
          Analyze Image & Generate Caption
        </button>

        {imageCaption && (
          <div style={{ marginTop: "1rem", border: "1px solid #ccc", padding: "1rem" }}>
            <h3>Generated Image Caption</h3>
            <div>{imageCaption}</div>
          </div>
        )}

      </section>
    </div>
  );
}

export default App;
