const axios = require('axios');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const AGGREGATOR = "https://aggregator.walrus-testnet.walrus.space";
const PUBLISHER = "https://publisher.walrus-testnet.walrus.space";

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
const savepath = 'model/model.py'

// helps to get the model on the client 
// app.post('/getmodel', async (req, res) => {
//     const blobID = req.body;
//     console.log(blobID);
//     console.log(req.body)
//     await get(blobID, savepath);
//     res.json(req.data);

// })

app.post('/ping', (req, res) => {
    return res.json('pong');
})

app.get('/getmodel', async (req, res) => {
    const blobID = req.query.data;
    console.log(blobID);
    await get(blobID, savepath);
    return res.json(req.query.data)
})

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});