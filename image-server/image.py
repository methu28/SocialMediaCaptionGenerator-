from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np

app = Flask(__name__)
CORS(app, origins=["https://socialmediacaptiongenerator-react.onrender.com"])

# Load Haar cascades
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
body_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_fullbody.xml')

def analyze_image(image_file):
    # Decode image bytes to OpenCV image
    img = cv2.imdecode(np.frombuffer(image_file.read(), np.uint8), cv2.IMREAD_COLOR)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Detect objects
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)
    eyes = eye_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)
    bodies = body_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=3)

    # Compose caption parts
    parts = []
    if len(faces) > 0:
        parts.append(f"{len(faces)} face{'s' if len(faces) > 1 else ''}")
    if len(eyes) > 0:
        parts.append(f"{len(eyes)} eye{'s' if len(eyes) > 1 else ''}")
    if len(bodies) > 0:
        parts.append(f"{len(bodies)} full body figure{'s' if len(bodies) > 1 else ''}")

    if parts:
        caption = "This photo shows " + ", ".join(parts) + " — capturing a vivid moment."
    else:
        caption = "A serene scene with subtle details inviting peaceful reflection."

    return caption

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'photo' not in request.files:
        return jsonify({"error": "No photo uploaded"}), 400

    photo_file = request.files['photo']
    caption = analyze_image(photo_file)

    return jsonify({"caption": caption})

if __name__ == '__main__':
    app.run()
