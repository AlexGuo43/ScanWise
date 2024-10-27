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
from pymongo import MongoClient
from bson.json_util import dumps
from flask_cors import CORS, cross_origin
import numpy as np
import certifi

app = Flask(__name__)
CORS(app)
loaded_model = joblib.load('random_forest_model.pkl')

# MongoDB connection URI
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb+srv://ashwinsant5:ashwinsant5@scanwise.198et.mongodb.net/?retryWrites=true&w=majority&appName=ScanWise')
client = MongoClient(MONGODB_URI, tlsAllowInvalidCertificates=True)
db = client['ScanWise']

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
    features['abnormal_url'] = 1 if hostname and re.search(hostname, url) else 0

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
    try:
        data = request.json
        if not data or 'image' not in data:
            return jsonify({'status': 'error', 'message': 'No image provided'}), 400

        # Decode the Base64 image
        image_data = data['image'].replace('data:image/png;base64,', '')
        image = Image.open(BytesIO(base64.b64decode(image_data)))

        # Convert PIL image to OpenCV format
        open_cv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

        # Perform QR code analysis
        result, url = analyze_qr_code(open_cv_image)

        # Handle case where no URL is detected in the QR code
        if not url:
            print("No URL detected from QR code analysis")  # Debugging line
            return jsonify({'status': 'error', 'message': 'No QR code detected'}), 200

        # Return the analysis result if URL is found
        return jsonify({'status': result, 'url': url}), 200

    except Exception as e:
        print(f"Error during /scan processing: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

def analyze_qr_code(image):
    detector = cv2.QRCodeDetector()
    data, bbox, _ = detector.detectAndDecode(image)
    if data and bbox is not None:
        features = extract_features(data)
        prediction = loaded_model.predict(pd.DataFrame([features]))[0]
        status = 'safe' if prediction == 0 else 'malicious'
        return status, data
    else:
        return 'safe', None

# Function to check if a link exists in the database
def does_safe_link_exist(url):
    safe_collection = db['safeLinks']

    existing_link_in_safe = safe_collection.find_one({'url': url})

    return existing_link_in_safe is not None

def does_malicious_link_exist(url):
    malicious_collection = db['maliciousLinks']

    existing_link_in_malicious = malicious_collection.find_one({'url': url})

    return existing_link_in_malicious is not None

# Function to add a link only if it doesn't exist
def add_link_if_not_exists(url, category):
    collection = db['maliciousLinks'] if category == 'malicious' else db['safeLinks']
    if not collection.find_one({'url': url}):
        collection.insert_one({'url': url, 'category': category})
        return True
    return False

@app.route('/checksafe-url', methods=['POST'])
def checksafe_url():
    data = request.json
    url = data.get('url')
    
    if url:
        exists = (does_safe_link_exist(url))
        return jsonify({'exists': exists}), 200
    return jsonify({'error': 'URL not provided'}), 400

@app.route('/checkmalicious-url', methods=['POST'])
def checkmalicious_url():
    try:
        data = request.json
        print("Received data for /checkmalicious-url:", data)  # Debugging line

        if not data:
            print("No JSON data received")  # Debugging line
            return jsonify({'error': 'No JSON data received'}), 400

        url = data.get('url')
        if not url:
            print("URL field is missing in the JSON data")  # Debugging line
            return jsonify({'error': 'URL field is missing in the JSON data'}), 400

        exists = (does_malicious_link_exist(url))
        return jsonify({'exists': exists}), 200

    except Exception as e:
        print(f"Error processing /checkmalicious-url request: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/report-url', methods=['POST'])
def report_url():
    data = request.json
    url = data.get('url')
    
    if url:
        added = add_link_if_not_exists(url, 'malicious')
        if added:
            return jsonify({'message': 'URL reported as malicious successfully'}), 200
        return jsonify({'message': 'URL already exists in database'}), 200
    
    return jsonify({'error': 'URL not provided'}), 400

app.run(host="0.0.0.0", port=5000, debug=True)