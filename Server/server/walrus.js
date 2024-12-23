const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const bodyParser = require('body-parser');
const ethers = require('ethers');
const abi = require('../../abi/blobIDstorage.json');

const AGGREGATOR = "https://aggregator.walrus-testnet.walrus.space";
const PUBLISHER = "https://publisher.walrus-testnet.walrus.space";




const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

/**
 * Upload a file to the Walrus publisher service.
 * 
 * @param {Buffer} fileBuffer - Buffer of the file to be uploaded
 * @returns {Promise<string>} Blob ID of the uploaded file
 */
async function upload(fileBuffer) {
    try {
        const url = `${PUBLISHER}/v1/store?epochs=5`;

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

        await require('fs').promises.writeFile(savePath, response.data);
        return true;
    } catch (error) {
        console.error(`Error downloading blob: ${error.message}`);
        return false;
    }
}

/**
 * API endpoint for uploading a file
 * returns the model 
 */
app.post('/modelupload', async (req, res) => {
    try {
        // Validate request data
        if (!req.body || !req.body.data) {
            return res.status(400).json({ error: 'No data provided' });
        }

        // Convert data to buffer
        const fileBuffer = Buffer.from(req.body.data, 'utf-8');
        const provider = new ethers.providers.JsonRpcProvider('https://ethereum-sepolia-rpc.publicnode.com');
        const signer = new ethers.Wallet('6b99711d264ac83b798ec10389f34afe53e6f6c6fdbb821b139aba9fd4cf9f2c', provider);
        const contractAddress = '0xeb640878c5f8D9E91A86786dC9c3E30E203EBc17';
        const blobIDstorage = new ethers.Contract(contractAddress, abi, signer);

        // Upload file directly
        const uploader = await upload(fileBuffer);
        console.log('Uploaded blob ID:', uploader);
        const res2 = await blobIDstorage.uploadBlobIDs(uploader);
        console.log(res2.hash)
        console.log("https://sepolia.etherscan.io/tx/" + res2.hash)

        res.status(200).send(uploader);
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
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Export for potential testing or module usage
module.exports = { app, upload, get };