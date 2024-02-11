/*
HEADER:
e2e is a file that builds the framework and file sturcture for Secure discord
*/

// Importing crypto and file system modules 
// Importing child_process module to run RSAKeyGen.js
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to execute RSAKeyGen.js
function generateKeys() 
{
    return new Promise((resolve, reject) => 
    {
        exec('node RSAKeyGen.js', (error, stdout, stderr) => 
        {
            if (error) 
            {
                console.error(`Error executing RSAKeyGen.js: ${error.message}`);
                reject(error);
            }
            if (stderr) 
            {
                console.error(`Error output from RSAKeyGen.js: ${stderr}`);
                reject(stderr);
            }
            console.log(stdout);
            resolve();
        });
    });
}

// Function to read private key from file
function readPrivateKey(filePath) 
{
    try 
    {
        return fs.readFileSync(filePath, 'utf8');
    } 
    catch (error) 
    {
        console.error(`Error reading private key from ${filePath}: ${error.message}`);
        throw error;
    }
}

// Function to run end-to-end process
async function runEndToEnd() 
{
    try 
    {
        // Generate RSA keys
        console.log("Generating RSA keys...");
        await generateKeys();
        
        // Read private key from file
        const privateKeyFilePath = path.join(__dirname, 'Secure_Discord/private/privateKey.pem');
        const privateKey = readPrivateKey(privateKeyFilePath);
        console.log("Private key:", privateKey);
        
        // Other end-to-end processes here add here...
    } 
    catch (error) 
    {
        console.error("End-to-end process failed:", error);
    }
}

// Run end-to-end process
runEndToEnd();