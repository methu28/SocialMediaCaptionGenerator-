from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import tempfile
import os

app = Flask(__name__)
# Allow your frontend domain explicitly
CORS(app, origins=["https://socialmediacaptiongenerator-react.onrender.com"])

def analyze_image(image_file):
    """Analyze the uploaded photo and generate a rich caption suitable for social media."""
    img = cv2.imdecode(np.frombuffer(image_file.read(), np.uint8), cv2.IMREAD_COLOR)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)

    if len(faces) > 0:
        return "A captivating portrait that highlights a unique face — perfect for sharing a moment of expression and connection! 😊✨"
    else:
        return "A serene scene that invites you to appreciate its hidden details and peaceful ambiance. 🌲✨"

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'photo' not in request.files:
        return jsonify({"error": "No photo uploaded"}), 400
    
    photo_file = request.files['photo']

    # Perform your image analysis here
    caption = "This is a nice photo without specifying dimensions."

    return jsonify({"caption": caption})

if __name__ == '__main__':
    app.run()


