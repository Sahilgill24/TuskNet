const axios = require('axios');
const express = require('express');
const cors = require('cors');
const { exec, spawn } = require('child_process');
const fs = require('fs').promises;
const { encrypt, decrypt } = require('./encryption')
const ethers = require('ethers');
const abi1 = require('../abi/staking.json')
const abi = require('../abi/proofstorage.json')





const app = express();
app.use(cors());

const AGGREGATOR = "https://aggregator.walrus-testnet.walrus.space";
const PUBLISHER = "https://publisher.walrus-testnet.walrus.space";


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
const savepath = 'model/model.py'

function run_script() {
    exec('./model/run.sh', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
    });
    const script = spawn('bash', ['./run.sh']);

    script.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

}


app.post('/training', async (req, res) => {
    // begins the training on the local machine of the contributor 
    // const provider = new ethers.providers.JsonRpcProvider('https://ethereum-sepolia-rpc.publicnode.com');
    // const signer = new ethers.Wallet('6b99711d264ac83b798ec10389f34afe53e6f6c6fdbb821b139aba9fd4cf9f2c', provider);
    // const contractAddress = '0x81E43957898eebaD04c0D5889324A8B46C27029C'
    // const stakingcontract = await ethers.Contract(contractAddress, abi1, signer)
    // const tx = await stakingcontract.stake({ value: 1021000000000 })
    // console.log(tx.hash)
    // console.log("https://sepolia.etherscan.io/tx/" + tx.hash)
    

    res.send('Training has begun');
    run_script();
})




app.get('/getmodel', async (req, res) => {
    const blobID = req.query.data;
    console.log(blobID);
    await get(blobID, savepath);
    return res.json(req.query.data)
})

app.get('/getEncryptedValues', async (req, res) => {
    try {
        const data = await fs.readFile('encryption.txt', 'utf8');
        const lines = data.split('\n');
        let salt = null;
        let encryptedCost = null;
        let val = null;


        // Extract salt and encrypted cost values from the file content
        lines.forEach(line => {
            if (line.startsWith('salt:')) {
                salt = line.replace('salt: ', '').trim();
            } else if (line.startsWith('Encrypted cost:')) {
                encryptedCost = line.replace('Encrypted cost: ', '').trim();
            }
            else if (line.startsWith('x:')) {
                val = line.replace('x: ', '').trim();
                encryptval = Buffer.from(val)

            }
        });
        const encryptedvalue = encrypt(encryptval)
        const uploader = await upload('encryption.txt');
        console.log('Uploaded blob ID:', uploader);
        const provider = new ethers.providers.JsonRpcProvider('https://ethereum-sepolia-rpc.publicnode.com');
        const signer = new ethers.Wallet('6b99711d264ac83b798ec10389f34afe53e6f6c6fdbb821b139aba9fd4cf9f2c', provider);
        const contractAddress = '0x7d5F3135FCd28916b13829023d45d1f948FaC87f';


        const contract = new ethers.Contract(contractAddress, abi, signer);

        const tx = await contract.uploadBlobIDs(uploader)
        console.log('Transaction hash:', tx.hash);
        console.log("https://sepolia.etherscan.io/tx/" + tx.hash)

        // Ensure both values are extracted
        return res.json({ uploader, encryptedvalue })
    } catch (error) {
        console.error("Error reading encryption.txt:", error);
        return res.status(500).send("Error reading encryption.txt");
    }
});


app.listen(4000, () => {
    console.log('Server is running on port 4000');
});