/*
HEADER:
This file will generate an random AES key.
called by e2e.js
*/

// Function to generate a random AES key with special characters, letters, and digits (Keyboards smashing noises)
function generateAESKey() 
{
    // Define the characters to be used in the key
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?';

    // Define the length of the key
    const keyLength = 32; // You can adjust the length as needed

    let key = '';

    // Generate a random key using the defined characters
    for (let i = 0; i < keyLength; i++) 
    {
        key += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return key;
}

// Example usage:
const aesKey = generateAESKey();
console.log("AES Key:", aesKey);