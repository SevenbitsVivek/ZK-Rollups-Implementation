require("dotenv").config();
const ethers = require('ethers');
const base64Helper = require('./base64Helper.js');
const polygonAbi = require('../artifacts/contracts/UpdateTransaction.sol/UpdateTransaction.json')["abi"]
const ethereumAbi = require('../artifacts/contracts/UpdateBase64Transaction.sol/UpdateBase64Transaction.json')["abi"]
const POLYGON_PROVIDER = new ethers.providers.JsonRpcProvider(process.env.POLYGON_PROVIDER);
const ETHEREUM_PROVIDER = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_PROVIDER);
const polygonWallet = new ethers.Wallet(process.env.POLYGON_TESTNET_PRIVATE_KEY, POLYGON_PROVIDER);
const ethereumWallet = new ethers.Wallet(process.env.GOERLI_TESTNET_PRIVATE_KEY, ETHEREUM_PROVIDER);
const polygonContract = new ethers.Contract(process.env.POLYGON_CONTRACT_ADDRESS, polygonAbi, polygonWallet);
const ethereumContract = new ethers.Contract(process.env.ETHEREUM_CONTRACT_ADDRESS, ethereumAbi, ethereumWallet);

async function setBase64(blockNumber, base64) {
    return new Promise(async (resolve, reject) => {
        var err;
        if (err) {
            reject(err);
        } else {
            const estimateGas = await polygonContract.estimateGas.setBase64(blockNumber, base64);
            const setBase64 = await polygonContract.setBase64(blockNumber, base64, { gasLimit: estimateGas.toString() });
            resolve(setBase64);
        }
    });
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
                await ethereumContract.setBase64(blockNumber, base64)
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
    return new Promise(async (resolve, reject) => {
        var err;
        if (err) {
            reject(err);
        } else {
            const getBlock = await POLYGON_PROVIDER.getBlock(START_BLOCK)
            resolve(getBlock);
        }
    });
}

async function getLatestBlockNumber() {
    return new Promise(async (resolve, reject) => {
        var err;
        if (err) {
            reject(err);
        } else {
            const getLatestBlockNumber = await POLYGON_PROVIDER.getBlockNumber();
            resolve(getLatestBlockNumber);
        }
    });
}

module.exports = {
    setBase64: setBase64,
    getBlock: getBlock,
    getPolygonEvent: getPolygonEvent,
    getEthereumEvent: getEthereumEvent,
    getLatestBlockNumber: getLatestBlockNumber
}