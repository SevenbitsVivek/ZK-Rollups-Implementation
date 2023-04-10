const fs = require('fs');
const fileHelper = require('./helper/fileHelper.js');
const etherHelper = require('./helper/etherHelper.js');
const base64Helper = require('./helper/base64Helper.js');

const updateTransactionInPolygon = async (req, res) => {
    try {
        var START_BLOCK
        START_BLOCK = await fileHelper.getStartBlock(START_BLOCK)
        const getLatestBlockNumber = await etherHelper.getLatestBlockNumber();
        console.log("START_BLOCK ===>", START_BLOCK)
        console.log("getLatestBlockNumber ===>", getLatestBlockNumber)
        if (START_BLOCK < getLatestBlockNumber) {
            START_BLOCK = START_BLOCK + 1
            const getBlock = await etherHelper.getBlock(START_BLOCK)
            console.log("getBlock ===>", getBlock.transactions)
            const encodeBase64 = await base64Helper.encodeBase64(getBlock.transactions);
            await etherHelper.setBase64(START_BLOCK, encodeBase64);
            await etherHelper.getPolygonEvent()
            await fileHelper.setLatestBlock(START_BLOCK);
        } else {
            console.log("All blocks are synced");
        }
    } catch (error) {
        console.log(error.message)
    }
}
// updateTransactionInPolygon()
setInterval(updateTransactionInPolygon, 2000);

//BigNumber conversion
//ethers.BigNumber.from(result.inputs[1]).toNumber()