/* 
HEADER:
This is a file for Secure discord project this file hold the encytion and decyption functions using AES.
This will allow users to send messages back and forth encytped once key is shared. 
e2e.js will use RSA and a random key generator to allow users to Verify that only the intended user gets the Message

Please Note infromation  and resources used in this file will be listed in the links below
1) https://cryptojs.gitbook.io/docs/
2) https://nodejs.org/api/crypto.html
3) https://developer.ibm.com/articles/secure-javascript-applications-with-web-crypto-api/
*/
const crypto = require("crypto");

function generateKey(passphrase) {
    return crypto.createHash('sha256').update(passphrase).digest();
}

// AES encryption function (using decrypted passphrase)
function encryptMessage(message, passphrase) {
    const key = generateKey(passphrase);
    const iv = crypto.randomBytes(16); // Generate a random IV (Initialization Vector)
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(message, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return {
        iv: iv.toString('base64'), // Convert IV to base64 string for storage/transfer
        encryptedMessage: encrypted
    };
}

// AES decryption function (using decrypted passphrase)
function decryptMessage(encryptedMessage, passphrase, iv) {
    const key = generateKey(passphrase);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'base64'));
    let decrypted = decipher.update(encryptedMessage, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// Example usage (simulates how the functions can be used between two parties)
// Public keys will be sent over insecure channel before anything else
const senderMessage = "Hello, receiver!";
console.log("Original message:", senderMessage);

// Alice encrypts passphrase with Bob's public key, then sends to Bob
const secretPassphrase = "youshallnotpass";
const encryptedPassphrase = encryptPassphrase(secretPassphrase, bobKeys.publicKey);
// Send to encryptedPassphrase to Bob here (done over insecure channel)

// Bob receives encrypted passphrase from Alice, then decrypts passphrase with Bob's private key
const decryptedPassphrase = decryptPassphrase(encryptedPassphrase, bobKeys.privateKey);
console.log("Decrypted passphrase:", decryptedPassphrase.toString());
// Now they should both have the passphrase, successfully shared over an insecure channel

// Sender (Alice) encrypts the message with secretPassphrase
const { iv, encryptedMessage } = encryptMessage(senderMessage, decryptedPassphrase.toString());
console.log("Encrypted message:", encryptedMessage);
console.log("Initialization Vector (IV):", iv);

// Receiver (Bob) decrypts the message using decrypted passphrase
const decryptedMessage = decryptMessage(encryptedMessage, decryptedPassphrase.toString(), iv);
console.log("Decrypted message:", decryptedMessage);