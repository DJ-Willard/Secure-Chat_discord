/*
HEADER:
This file will create a RSA public and private key and generate an random AES key.
This file will use RSA and a random key generator to allow users to Verify that only the intended user gets the Message

Documentation used:
1) https://www.sohamkamani.com/nodejs/rsa-encryption/
2) https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt
3) https://stackoverflow.com/questions/17685645/rsa-encryption-javascript
4) https://sourceforge.net/projects/pidcrypt/
5) https://www.npmjs.com/package/js-crypto-rsa 
6)
*/

// Importing crypto module 
const crypto = require('crypto');

// Function to generate RSA key pair
function generateRSAKeys() 
{
      // Generate RSA key pair
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', 
    {
        // Length of the RSA key, usually 2048 or 4096 using 4096 for greater security 
        modulusLength: 4096, 
        publicKeyEncoding: 
        {
            // Public key encoding type
            /*
            PKCS#1 is one of the most widely used formats for encoding RSA private keys.
             "Public-Key Cryptography Standards #1". It's a set of standards originally developed by RSA Laboratories
             */
            type: 'pkcs1', 
            // Output format
            /*
            PEM is a widely used format for encoding cryptographic objects.
             It consists of base64-encoded ASCII data enclosed between 
             "-----BEGIN ..." and "-----END ..." markers.
            */
            format: 'pem' 
        },
        privateKeyEncoding: 
        {
            // Private key encoding type
            type: 'pkcs1', 
            format: 'pem' 
        }
    });

    return { privateKey, publicKey };
}

// Function to save the private key to a file
function savePrivateKey(privateKey, filePath) 
{
    // Set file permission to read-write for the owner only
    fs.writeFileSync(filePath, privateKey, { mode: 0o600 }); 
}

// Function to create hidden directory
function createHiddenDirectory(dirPath) 
{
    // Create the directory if it doesn't exist
    if (!fs.existsSync(dirPath)) 
    {
        fs.mkdirSync(dirPath);
        // Make the directory hidden
        fs.writeFileSync(path.join(dirPath, '.gitignore'), '*');
    }
}


// Generate RSA keys
const { privateKey } = generateRSAKeys();

// Define the path to the hidden folder (MAY NEED TO CHANGE FOLDER)
//TODO
const hiddenFolderPath = './Secure_Discord/private';

// Create the hidden directory
createHiddenDirectory(hiddenFolderPath);

// Define the path to save the private key file
const privateKeyFilePath = path.join(hiddenFolderPath, 'privateKey.pem');

// Save the private key to a file
savePrivateKey(privateKey, privateKeyFilePath);

console.log("Private key saved to:", privateKeyFilePath);