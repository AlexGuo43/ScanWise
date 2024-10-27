from pymongo import MongoClient

# MongoDB connection URI (without SSL)
MONGODB_URI = 'mongodb+srv://ashwinsant5:ashwinsant5@scanwise.198et.mongodb.net/?retryWrites=true&w=majority&appName=ScanWise'

try:
    # Attempt to connect to MongoDB (SSL disabled for testing)
    client = MongoClient(MONGODB_URI, tlsAllowInvalidCertificates=True)
    db = client['ScanWise']

    # Attempt a simple query to verify connection
    result = db['maliciousLinks'].find_one()
    print("Successfully connected to MongoDB!")
    print("Sample record from 'maliciousLinks':", result)

except Exception as e:
    print(f"Error connecting to MongoDB: {str(e)}")