const ethers = require('ethers');
const etherHelper = require('./helper/etherHelper.js');
const base64Helper = require('./helper/base64Helper.js');
const ethereumAbi = require('./artifacts/contracts/UpdateBase64Transaction.sol/UpdateBase64Transaction.json')["abi"]
const ETHEREUM_PROVIDER = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_PROVIDER);
const ethereumWallet = new ethers.Wallet(process.env.GOERLI_TESTNET_PRIVATE_KEY, ETHEREUM_PROVIDER);
const ethereumContract = new ethers.Contract(process.env.ETHEREUM_CONTRACT_ADDRESS, ethereumAbi, ethereumWallet);

var EventData

polygonContract.on("SetBase64", async (from, blockNumber, base64) => {
    EventData = {
        from: from,
        blockNumber: blockNumber.toString(),
        base64: base64,
        timestamp: Date.now()
    }
    console.log(JSON.stringify(EventData, null, 5))
    await etherHelper.setBase64InEthereum(blockNumber, encodeBase64)
})

ethereumContract.on("SetBase64", async (from, blockNumber, base64) => {
    let EventDataInEthereum = {
        from: from,
        blockNumber: blockNumber.toString(),
        base64: base64,
        timestamp: Date.now()
    }
    console.log(JSON.stringify(EventDataInEthereum, null, 5))
    if (EventData.blockNumber === blockNumber) {
        await base64Helper.decodeBase64(base64)
    }
})