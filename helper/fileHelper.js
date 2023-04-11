const fs = require('fs');

async function setLatestBlock(blockNumber) {
    fs.writeFile('deposit.json', blockNumber.toString(), function (err) {
        try {
            console.log('Value updated in json file');
            return blockNumber;
        } catch (error) {
            throw error;
        }
    });
}

async function getStartBlock(startBlock) {
    fs.readFile('deposit.json', function (err, data) {
        try {
            startBlock = JSON.parse(data);
            return startBlock;
        } catch (error) {
            throw error;
        }
    });
}

module.exports = {
    setLatestBlock: setLatestBlock,
    getStartBlock: getStartBlock
}