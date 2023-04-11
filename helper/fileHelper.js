const fs = require('fs');

async function setLatestBlock(blockNumber) {
    return new Promise((resolve, reject) => {
        fs.writeFile('Block.json', blockNumber.toString(), function (err) {
            if (err) {
                reject(err);
            } else {
                console.log('Value updated in json file');
                resolve(blockNumber);
            }
        });
    });
}

async function getStartBlock(startBlock) {
    return new Promise((resolve, reject) => {
        fs.readFile('Block.json', function (err, data) {
            if (err) {
                reject(err);
            } else {
                startBlock = JSON.parse(data);
                resolve(startBlock);
            }
        });
    });
}

module.exports = {
    setLatestBlock: setLatestBlock,
    getStartBlock: getStartBlock
}