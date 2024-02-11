// Importing necessary modules
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to run the end-to-end process and check if the private key file is generated
function testEndToEnd() {
    try {
        // Execute the end-to-end script
        console.log("Running end-to-end script...");
        execSync('node e2e.js');

        // Check if the private key file is generated
        const privateKeyFilePath = path.join(__dirname, 'Secure_Discord/private/privateKey.pem');
        if (fs.existsSync(privateKeyFilePath)) {
            console.log("Private key file generated successfully.");
            console.log("Test passed!");
        } else {
            console.error("Private key file not found.");
            console.error("Test failed!");
        }
    } catch (error) {
        console.error("Test failed with error:", error.message);
    }
}

// Run the test
testEndToEnd();