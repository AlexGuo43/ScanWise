from flask import Flask, request, jsonify
from PIL import Image
import base64
from io import BytesIO
import os

app = Flask(__name__)

# Endpoint to receive and analyze the image
@app.route('/scan', methods=['POST'])
def scan_qr_code():
    data = request.json
    if not data or 'image' not in data:
        return jsonify({'status': 'error', 'message': 'No image provided'}), 400

    # Decode the Base64 image
    image_data = data['image'].replace('data:image/png;base64,', '')
    image = Image.open(BytesIO(base64.b64decode(image_data)))

    # Here you should add QR code analysis logic
    # For simplicity, let's assume the QR code is either 'safe' or 'malicious'
    result = analyze_qr_code(image)

    # Return the analysis result
    return jsonify({'status': result})

def analyze_qr_code(image):
    # Dummy analysis function, replace with actual QR analysis
    # In a real case, you'd decode the QR code and determine if it's safe
    return 'safe'  # or 'malicious'

if __name__ == '__main__':
    app.run(port=5000, debug=True)