const fileHelper = require('./helper/fileHelper.js');
const etherHelper = require('./helper/etherHelper.js');
const base64Helper = require('./helper/base64Helper.js');

let isProcessing = false; // Flag to keep track of processing status

const updateTransactionInPolygon = async (req, res) => {
    try {
        if (!isProcessing) { // Check if already processing
            isProcessing = true; // Set flag to true to indicate processing started
            var START_BLOCK;
            START_BLOCK = await fileHelper.getStartBlock(START_BLOCK);
            const getLatestBlockNumber = await etherHelper.getLatestBlockNumber();
            console.log("getLatestBlockNumber ===>", getLatestBlockNumber);
            if (START_BLOCK < getLatestBlockNumber) {
                START_BLOCK = START_BLOCK + 1;
                console.log("START_BLOCK ===>", START_BLOCK);
                const getBlock = await etherHelper.getBlock(START_BLOCK);
                console.log("getBlock ===>", getBlock.transactions);
                const encodeBase64 = await base64Helper.encodeBase64(getBlock.transactions);
                await etherHelper.setBase64InPolygon(START_BLOCK, encodeBase64);
                await etherHelper.getPolygonEvent();
                await etherHelper.setBase64InEthereum(START_BLOCK, encodeBase64)
                await etherHelper.getEthereumEvent();
                await fileHelper.setLatestBlock(START_BLOCK);
            } else {
                console.log("All blocks are synced");
            }
            isProcessing = false; // Set flag to false to indicate processing finished
        } else {
            console.log("Already processing, skipping...");
        }
    } catch (error) {
        console.log(error.message);
        isProcessing = false; // Set flag to false in case of error
    }
};

updateTransactionInPolygon();
setInterval(updateTransactionInPolygon, 1500);

//BigNumber conversion
//ethers.BigNumber.from(result.inputs[1]).toNumber()