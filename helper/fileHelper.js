const fs = require('fs');

async function setLatestBlock(blockNumber) {
    return new Promise((resolve, reject) => {
        fs.writeFile('deposit.json', blockNumber.toString(), function (err) {
            if (err) {
                reject(err);
            } else {
                console.log('Value updated in json file');
                resolve(blockNumber);
            }
        });
    });
}

module.exports = {
    setLatestBlock: setLatestBlock
}