# ScanWise - QR Code Phishing Detection and URL Safety Checker

ScanWise is a powerful cybersecurity tool designed to protect users from the increasing threat of QR code phishing. By leveraging computer vision, machine learning, and cloud infrastructure, ScanWise scans QR codes, extracts URLs, and instantly assesses their safety. The system uses a combination of advanced AI analysis and user-driven feedback to continuously improve threat detection, making it a robust solution for safe digital interactions.

## Features
- **QR Code Scanning:** ScanWise uses the OpenCV library for real-time QR code detection. Users activate their device’s camera, allowing the tool to capture and decode QR codes seamlessly. The system handles a wide range of QR codes, extracting URLs even under varying lighting conditions or image quality. If the captured image does not contain a QR code, ScanWise provides clear feedback to the user, ensuring a smooth and intuitive scanning experience.
- **URL Classification:** At the core of ScanWise is a Random Forest machine learning model that has been trained on a diverse dataset of both safe and malicious URLs. Once a URL is extracted from a QR code, the AI model analyzes it based on several security factors, including URL structure, use of special characters, and other known indicators of malicious intent. This classification allows users to receive immediate alerts if a URL is deemed unsafe, helping to prevent phishing and other online threats.
- **User Reporting:** To enhance the accuracy and adaptability of ScanWise, users are empowered to contribute to the system’s database by reporting URLs they believe to be malicious. Each reported URL is securely stored in a cloud-hosted MongoDB Atlas database, which is referenced during future scans. This user-driven feedback loop allows the system to improve over time, reinforcing AI predictions with real-world user experiences and continuously strengthening its threat detection capabilities.

## **Dependencies**

To run ScanWise, make sure to install the necessary dependencies. All required packages are listed in the `requirementsB.txt` file. Use the following command to install them: pip install -r requirements.txt


### Python Libraries
- `opencv-python`: for capturing and decoding QR codes
- `sklearn`: for training and using the Random Forest model
- `numpy`, `pandas`: for data handling and preprocessing

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
