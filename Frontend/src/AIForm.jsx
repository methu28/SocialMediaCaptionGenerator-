// src/AIForm.jsx
import { useState } from "react";
import axios from "axios";

function AIForm() {
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("informal");
  const [length, setLength] = useState("short");
  const [format, setFormat] = useState("paragraph");
  const [result, setResult] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/generate", {
        prompt,
        tone,
        length,
        format,
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error generating content", error);
    }
  };

  return (
    <div>
      <h2>AI SocialMedia Generator</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <select value={tone} onChange={(e) => setTone(e.target.value)}>
          <option value="informal">Informal</option>
          <option value="formal">Formal</option>
        </select>
        <select value={length} onChange={(e) => setLength(e.target.value)}>
          <option value="short">Short</option>
          <option value="medium">Medium</option>
          <option value="long">Long</option>
        </select>
        <select value={format} onChange={(e) => setFormat(e.target.value)}>
          <option value="paragraph">Paragraph</option>
          <option value="bullet points">Bullet Points</option>
          <option value="tweet">Tweet</option>
        </select>
        <button type="submit">Generate</button>
      </form>
      <div>
        <h3>Generated Content:</h3>
        <p>{result}</p>
      </div>
    </div>
  );
}

export default AIForm;
