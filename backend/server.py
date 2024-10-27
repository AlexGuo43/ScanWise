from flask import Flask, request, jsonify, make_response
from PIL import Image
import base64
from io import BytesIO
import os
import joblib
import pandas as pd
import re
from urllib.parse import urlparse
from tld import get_tld
import cv2
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app, resources={r"/scan": {"origins": "http://localhost:3000"}}, supports_credentials=True)
loaded_model = joblib.load('random_forest_model.pkl')

def extract_features(url):
    features = {}

    # Remove 'www.' if present
    url = re.sub(r'www\.', '', url)
    
    # Length of the URL
    features['url_len'] = len(str(url))
    
    # Count special characters
    feature_chars = ['@', '?', '-', '=', '.', '#', '%', '+', '$', '!', '*', ',', '//']
    for char in feature_chars:
        features[char] = url.count(char)

    # Abnormal URL check
    hostname = urlparse(url).hostname
    features['abnormal_url'] = 1 if re.search(hostname, url) else 0

    # Check for HTTPS
    features['https'] = 1 if urlparse(url).scheme == 'https' else 0

    # Digit count
    features['digits'] = sum(c.isnumeric() for c in url)

    # Letter count
    features['letters'] = sum(c.isalpha() for c in url)

    # Check for shortening service
    shortening_services = (
        'bit\.ly|goo\.gl|shorte\.st|go2l\.ink|x\.co|ow\.ly|t\.co|tinyurl|tr\.im|is\.gd|cli\.gs|'
        'yfrog\.com|migre\.me|ff\.im|tiny\.cc|url4\.eu|twit\.ac|su\.pr|twurl\.nl|snipurl\.com|'
        'short\.to|BudURL\.com|ping\.fm|post\.ly|Just\.as|bkite\.com|snipr\.com|fic\.kr|loopt\.us|'
        'doiop\.com|short\.ie|kl\.am|wp\.me|rubyurl\.com|om\.ly|to\.ly|bit\.do|t\.co|lnkd\.in|'
        'db\.tt|qr\.ae|adf\.ly|goo\.gl|bitly\.com|cur\.lv|tinyurl\.com|ow\.ly|bit\.ly|ity\.im|'
        'q\.gs|is\.gd|po\.st|bc\.vc|twitthis\.com|u\.to|j\.mp|buzurl\.com|cutt\.us|u\.bb|yourls\.org|'
        'x\.co|prettylinkpro\.com|scrnch\.me|filoops\.info|vzturl\.com|qr\.net|1url\.com|tweez\.me|v\.gd|'
        'tr\.im|link\.zip\.net'
    )
    features['Shortining_Service'] = 1 if re.search(shortening_services, url) else 0

    # Check for IP address
    ip_regex = (
        '(([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\/)|'  # IPv4
        '(([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\/)|'  # IPv4 with port
        '((0x[0-9a-fA-F]{1,2})\\.(0x[0-9a-fA-F]{1,2})\\.(0x[0-9a-fA-F]{1,2})\\.(0x[0-9a-fA-F]{1,2})\\/)' # IPv4 in hexadecimal
        '(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}|'
        '([0-9]+(?:\.[0-9]+){3}:[0-9]+)|'
        '((?:(?:\d|[01]?\d\d|2[0-4]\d|25[0-5])\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d|\d)(?:\/\d{1,2})?)'  # IPv6
    )
    features['having_ip_address'] = 1 if re.search(ip_regex, url) else 0

    return features

# Endpoint to receive and analyze the image
@app.route('/scan', methods=['POST'])
@cross_origin()
def scan_qr_code():
    if request.method == 'OPTIONS':
        # Handling preflight CORS request
        response = make_response()
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response

    # Proceed with the POST request
    data = request.json
    if not data or 'image' not in data:
        response = make_response(jsonify({'status': 'error', 'message': 'No image provided'}), 400)
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response

    # Decode the Base64 image
    image_data = data['image'].replace('data:image/png;base64,', '')
    image = Image.open(BytesIO(base64.b64decode(image_data)))

    # QR code analysis logic
    result = analyze_qr_code(image)

    # Return the analysis result with CORS headers
    response = make_response(jsonify({'status': result}))
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

def analyze_qr_code(image):
    # Dummy analysis function, replace with actual QR analysis
    # In a real case, you'd decode the QR code and determine if it's safe
    detector = cv2.QRCodeDetector()
    data, bbox, _ = detector.detectAndDecode(image)
    if data and bbox is not None:
        return 'safe' if loaded_model.predict(pd.DataFrame([extract_features(data)])) == 0 else 'malicious'
    else:
        return 'safe'  # or 'malicious'

app.run(host="0.0.0.0", port=5000, debug=True)
