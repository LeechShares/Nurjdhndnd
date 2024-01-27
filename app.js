const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Function to encrypt a string
function encrypt(text, password) {
    const cipher = crypto.createCipher('aes-256-cbc', password);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// Function to decrypt a string
function decrypt(encryptedText, password) {
    const decipher = crypto.createDecipher('aes-256-cbc', password);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Route for index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for index.html
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});


// Route for app.html
app.get('/app', (req, res) => {
    const htmlPath = path.join(__dirname, 'public', 'app.html');
    const password = 'rejard'; // Change this to your secret password

    // Read and encrypt the content of app.html
    fs.readFile(htmlPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading app.html:', err);
            return res.status(500).send('Internal Server Error');
        }

        // Encrypt the content
        const encryptedHTML = encrypt(data, password);

        // Decrypt the content before sending it to the client
        const decryptedHTML = decrypt(encryptedHTML, password);

        // Send the decrypted content as response
        res.send(decryptedHTML);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`TikTok Glitch is running on http://localhost:${PORT}`);
});