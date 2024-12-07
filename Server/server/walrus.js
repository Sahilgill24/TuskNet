const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const bodyParser = require('body-parser');

const UPLOAD_FOLDER = 'model/';
const FILENAME = 'model.py';
const AGGREGATOR = "https://aggregator.walrus-testnet.walrus.space";
const PUBLISHER = "https://publisher.walrus-testnet.walrus.space";

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

/**
 * Upload a file to the Walrus publisher service.
 * 
 * @param {string} filePath - Path to the file to be uploaded
 * @returns {Promise<string>} Blob ID of the uploaded file
 */
async function upload(filePath) {
    try {
        const url = `${PUBLISHER}/v1/store?epochs=5`;
        const fileBuffer = await fs.readFile(filePath);

        const response = await axios({
            method: 'put',
            url: url,
            data: fileBuffer,
            headers: {
                'Content-Type': 'application/octet-stream'
            }
        });

        const jsonResponse = response.data;
        console.log(jsonResponse);

        if (jsonResponse.alreadyCertified) {
            return jsonResponse.alreadyCertified.blobId;
        }

        return jsonResponse.newlyCreated.blobObject.blobId;
    } catch (error) {
        console.error(`Error uploading file: ${error.message}`);
        throw error;
    }
}

/**
 * Download a blob from the Walrus aggregator service.
 * 
 * @param {string} blobId - ID of the blob to download
 * @param {string} savePath - Path to save the downloaded file
 * @returns {Promise<boolean>} True if download successful, false otherwise
 */
async function get(blobId, savePath) {
    try {
        const url = `${AGGREGATOR}/v1/${blobId}`;
        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'arraybuffer'
        });

        await fs.writeFile(savePath, response.data);
        return true;
    } catch (error) {
        console.error(`Error downloading blob: ${error.message}`);
        return false;
    }
}

/**
 * Ensure the upload directory exists
 */
async function ensureUploadDirectory() {
    try {
        await fs.mkdir(UPLOAD_FOLDER, { recursive: true });
    } catch (error) {
        if (error.code !== 'EEXIST') {
            console.error(`Error creating upload directory: ${error.message}`);
            throw error;
        }
    }
}

/**
 * API endpoint for uploading a file
 */
app.post('/api_testing', async (req, res) => {
    try {
        // Validate request data
        if (!req.body || !req.body.data) {
            return res.status(400).json({ error: 'No data provided' });
        }

        // Ensure upload directory exists
        await ensureUploadDirectory();

        // Construct full file path
        const filePath = path.join(UPLOAD_FOLDER, FILENAME);

        // Write file content
        await fs.writeFile(filePath, req.body.data);

        // Upload file
        const uploader = await upload(filePath);
        console.log('Uploaded blob ID:', uploader);

        res.status(200).send('done');
    } catch (error) {
        console.error(`Unexpected error: ${error.message}`);

        // Differentiate between different types of errors
        if (error.name === 'TypeError') {
            return res.status(400).json({ error: 'Invalid data format' });
        }

        res.status(500).json({
            error: 'An unexpected error occurred',
            details: error.message
        });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Export for potential testing or module usage
module.exports = { app, upload, get };