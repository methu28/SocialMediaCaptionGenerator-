from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import cv2
import tempfile
import requests

app = Flask(__name__)
CORS(app)

def analyze_image(image_path):
    """Analyze an image to find dimensions and number of faces."""
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Could not load image from path: {image_path}")

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
    )
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    height, width = image.shape[:2]
    summary = f"The image is {width}x{height} pixels. "

    if isinstance(faces, tuple) or len(faces) == 0:
        summary += "No faces detected."
    else:
        summary += f"It contains {len(faces)} face(s)."

    return summary

@app.route("/analyze", methods=["POST"])
def analyze():
    """Analyze an uploaded photo and generate a caption for it."""
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image_file = request.files["image"]
    temp_file = os.path.join(tempfile.gettempdir(), image_file.filename)
    image_file.save(temp_file)

    summary = analyze_image(temp_file)

    # Retrieve optional settings from form
    tone = request.form.get("tone", "neutral")
    length = request.form.get("length", "short")
    fmt = request.form.get("format", "paragraph")
    prompt = f"Create a caption for a social media post: {summary}"

    payload = {
        "prompt": prompt,
        "tone": tone,
        "length": length,
        "format": fmt
    }
    try:
        response = requests.post("https://socialmediacaptiongenerator-boot.onrender.com/api/generate", json=payload)
        response.raise_for_status()
        caption = response.text
    except Exception as e:
        caption = f"Error calling Java backend: {str(e)}"

    return jsonify({"summary": summary, "caption": caption})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
