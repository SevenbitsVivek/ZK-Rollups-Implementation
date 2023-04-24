const ethers = require('ethers');
const etherHelper = require('./helper/EtherHelper.js');
const base64Helper = require('./helper/Base64Helper.js');
const polygonAbi = require('./artifacts/contracts/UpdateTransaction.sol/UpdateTransaction.json')["abi"]
const ethereumAbi = require('./artifacts/contracts/UpdateBase64Transaction.sol/UpdateBase64Transaction.json')["abi"]
const POLYGON_PROVIDER = new ethers.providers.JsonRpcProvider(process.env.POLYGON_PROVIDER);
const ETHEREUM_PROVIDER = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_PROVIDER);
const polygonWallet = new ethers.Wallet(process.env.POLYGON_TESTNET_PRIVATE_KEY, POLYGON_PROVIDER);
const ethereumWallet = new ethers.Wallet(process.env.GOERLI_TESTNET_PRIVATE_KEY, ETHEREUM_PROVIDER);
const polygonContract = new ethers.Contract(process.env.POLYGON_CONTRACT_ADDRESS, polygonAbi, polygonWallet);
const ethereumContract = new ethers.Contract(process.env.ETHEREUM_CONTRACT_ADDRESS, ethereumAbi, ethereumWallet);

var EventData;

polygonContract.on("SetBase64", async (from, blockNumber, base64) => {
    EventData = {
        from: from,
        blockNumber: blockNumber.toString(),
        base64: base64,
        timestamp: Date.now()
    }
    console.log(JSON.stringify(EventData, null, 5))
    await etherHelper.setBase64InEthereum(blockNumber, base64)
})

ethereumContract.on("SetBase64", async (from, blockNumber, base64) => {
    let EventDataInEthereum = {
        from: from,
        blockNumber: blockNumber.toString(),
        base64: base64,
        timestamp: Date.now()
    }
    console.log(JSON.stringify(EventDataInEthereum, null, 5))
    if (Number(EventData.blockNumber) === Number(blockNumber)) {
        await base64Helper.decodeBase64(base64)
    } else {
        console.log("BlockNumber dosen`t match");
    }
})