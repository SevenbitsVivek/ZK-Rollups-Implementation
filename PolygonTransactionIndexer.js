const ethers = require('ethers');
const fileHelper = require('./helper/fileHelper.js');
const etherHelper = require('./helper/etherHelper.js');
const base64Helper = require('./helper/base64Helper.js');
const polygonAbi = require('./artifacts/contracts/UpdateTransaction.sol/UpdateTransaction.json')["abi"]
const POLYGON_PROVIDER = new ethers.providers.JsonRpcProvider(process.env.POLYGON_PROVIDER);
const polygonWallet = new ethers.Wallet(process.env.POLYGON_TESTNET_PRIVATE_KEY, POLYGON_PROVIDER);
const polygonContract = new ethers.Contract(process.env.POLYGON_CONTRACT_ADDRESS, polygonAbi, polygonWallet);

var START_BLOCK;

const startTransactionIndexing = async (req, res) => {
    try {
        console.log("Transaction ndexing has been started");
        START_BLOCK = await fileHelper.getStartBlock(START_BLOCK);
        console.log("START_BLOCK ===>", START_BLOCK);
        const getLatestBlockNumber = await etherHelper.getLatestBlockNumber();
        console.log("getLatestBlockNumber ===>", getLatestBlockNumber);
        console.log("START_BLOCK < getLatestBlockNumber ===>", START_BLOCK < getLatestBlockNumber);
        if (START_BLOCK < getLatestBlockNumber) {
            console.log("Start block is less than latestBlock");
            START_BLOCK = START_BLOCK + 1;
            const getBlock = await etherHelper.getBlock(START_BLOCK);
            console.log("getBlock ===>", getBlock.transactions);
            const encodeBase64 = await base64Helper.encodeBase64(getBlock.transactions);
            console.log("encodeBase64 ===>", encodeBase64);
            const transaction = await etherHelper.setBase64InPolygon(START_BLOCK, encodeBase64);
            console.log("transaction ===>", transaction)
        } else {
            console.log("All blocks are synced");
        }
    } catch (error) {
        console.log(error.message);
    }
};

startTransactionIndexing();

polygonContract.on("SetBase64", async (from, blockNumber, base64) => {
    let EventData = {
        from: from,
        blockNumber: blockNumber.toString(),
        base64: base64,
        timestamp: Date.now()
    }
    console.log("EventData ===>", JSON.stringify(EventData, null, 5))
    console.log("blockNumber ===>", blockNumber);
    console.log("START_BLOCK ===>", START_BLOCK);
    console.log("blockNumber === START_BLOCK ===>", blockNumber === START_BLOCK);
    if (Number(blockNumber) === Number(START_BLOCK)) {
        console.log("blockNumber is equal to START_BLOCK");
        await fileHelper.setLatestBlock(START_BLOCK);
        startTransactionIndexing();
    }
})