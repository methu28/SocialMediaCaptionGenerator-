from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import cv2
import tempfile

app = Flask(__name__)

# Allow only your React's domain to connect
CORS(app, origins=['https://socialmediacaptiongenerator-react.onrender.com'])

def analyze_image(image_path):
    """Analyze the photo and return a short summary."""
    image = cv2.imread(image_path)
    if image is None:
        return "Unable to read the photo."

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
    )
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    if len(faces) == 0:
        return "No faces were detected in the photo."
    else:
        return f"The photo shows {len(faces)} face(s)"

@app.route("/analyze", methods=["POST"])
def analyze():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image_file = request.files["image"]
    temp_file = os.path.join(tempfile.gettempdir(), image_file.filename)
    image_file.save(temp_file)

    summary = analyze_image(temp_file)

    return jsonify({"summary": summary})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
