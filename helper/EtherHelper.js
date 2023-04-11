require("dotenv").config();
const ethers = require('ethers');
const base64Helper = require('./Base64Helper.js');
const polygonAbi = require('../artifacts/contracts/UpdateTransaction.sol/UpdateTransaction.json')["abi"]
const ethereumAbi = require('../artifacts/contracts/UpdateBase64Transaction.sol/UpdateBase64Transaction.json')["abi"]
const POLYGON_PROVIDER = new ethers.providers.JsonRpcProvider('https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78');
const ETHEREUM_PROVIDER = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_PROVIDER);
const polygonWallet = new ethers.Wallet(process.env.POLYGON_TESTNET_PRIVATE_KEY, POLYGON_PROVIDER);
const ethereumWallet = new ethers.Wallet(process.env.GOERLI_TESTNET_PRIVATE_KEY, ETHEREUM_PROVIDER);
const polygonContract = new ethers.Contract(process.env.POLYGON_CONTRACT_ADDRESS, polygonAbi, polygonWallet);
const ethereumContract = new ethers.Contract(process.env.ETHEREUM_CONTRACT_ADDRESS, ethereumAbi, ethereumWallet);

async function setBase64InPolygon(blockNumber, base64) {
    let alreadyKnownErrorHandled = false; // Variable to track if the "already known" error has been handled
    try {
        const estimateGas = await polygonContract.estimateGas.setBase64(blockNumber, base64);
        const setBase64 = await polygonContract.setBase64(blockNumber, base64, { gasLimit: estimateGas.toString() * 2 });
        return (setBase64);
    } catch (error) {
        if (error.message && error.message.includes("already known") && !alreadyKnownErrorHandled) {
            // Handle the "already known" error only if it has not been handled already
            alreadyKnownErrorHandled = true; // Set the variable to true to indicate the error has been handled
            throw new Error("The operation has already been processed.");
        } else {
            // Handle other errors
            throw error;
        }
    }
}

async function setBase64InEthereum(blockNumber, base64) {
    let alreadyKnownErrorHandled = false; // Variable to track if the "already known" error has been handled
    try {
        const estimateGas = await ethereumContract.estimateGas.setBase64(blockNumber, base64);
        const setBase64 = await ethereumContract.setBase64(blockNumber, base64, { gasLimit: estimateGas.toString() * 2 })
        return setBase64;
    } catch (error) {
        if (error.message && error.message.includes("already known") && !alreadyKnownErrorHandled) {
            // Handle the "already known" error only if it has not been handled already
            alreadyKnownErrorHandled = true; // Set the variable to true to indicate the error has been handled
            throw new Error("The operation has already been processed.");
        } else {
            // Handle other errors
            throw error;
        }
    }
}

async function getPolygonEvent() {
    return new Promise(async (resolve, reject) => {
        var err;
        if (err) {
            reject(err);
        } else {
            const polygonEvent = polygonContract.on("SetBase64", async (from, blockNumber, base64) => {
                let SetBase64 = {
                    from: from,
                    blockNumber: blockNumber.toString(),
                    base64: base64,
                    timestamp: Date.now()
                }
                console.log(JSON.stringify(SetBase64, null, 5))
            })
            resolve(polygonEvent);
        }
    });
}

async function getEthereumEvent() {
    return new Promise(async (resolve, reject) => {
        var err;
        if (err) {
            reject(err);
        } else {
            const ethereumEvent = ethereumContract.on("SetBase64", async (from, blockNumber, base64) => {
                let SetBase64 = {
                    from: from,
                    blockNumber: blockNumber.toString(),
                    base64: base64,
                    timestamp: Date.now()
                }
                console.log(JSON.stringify(SetBase64, null, 5))
                await base64Helper.decodeBase64(base64)
            })
            resolve(ethereumEvent);
        }
    });
}

async function getBlock(START_BLOCK) {
    try {
        const getBlock = await POLYGON_PROVIDER.getBlock(START_BLOCK)
        return getBlock;
    } catch (error) {
        throw error;
    }
}

async function getLatestBlockNumber() {
    try {
        const getLatestBlockNumber = await POLYGON_PROVIDER.getBlockNumber();
        return getLatestBlockNumber;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    setBase64InPolygon: setBase64InPolygon,
    setBase64InEthereum: setBase64InEthereum,
    getBlock: getBlock,
    getPolygonEvent: getPolygonEvent,
    getEthereumEvent: getEthereumEvent,
    getLatestBlockNumber: getLatestBlockNumber
}