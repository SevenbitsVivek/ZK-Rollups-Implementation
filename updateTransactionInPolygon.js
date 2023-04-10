const fs = require('fs');
require("dotenv").config();
const ethers = require('ethers');
const fileHelper = require('./helper/fileHelper.js');
const polygonAbi = require('./artifacts/contracts/UpdateTransaction.sol/UpdateTransaction.json')["abi"]

const updateTransactionInPolygon = async (req, res) => {
    try {
        var START_BLOCK
        const POLYGON_PROVIDER = new ethers.providers.JsonRpcProvider(process.env.POLYGON_PROVIDER);
        const polygonWallet = new ethers.Wallet(process.env.POLYGON_TESTNET_PRIVATE_KEY, POLYGON_PROVIDER);
        const contractInPolygon = new ethers.Contract(process.env.POLYGON_CONTRACT_ADDRESS, polygonAbi, polygonWallet);
        var processedTransaction = []
        fs.readFile("deposit.json", async function (err, data) {
            if (err) throw err;
            const users = JSON.parse(data);
            START_BLOCK = users
            const latestBlockNumber = await POLYGON_PROVIDER.getBlockNumber();
            console.log("START_BLOCK ===>", START_BLOCK)
            console.log("latestBlockNumber ===>", latestBlockNumber)
            if (START_BLOCK < latestBlockNumber) {
                const getBlockWithTransactions = await POLYGON_PROVIDER.getBlockWithTransactions(START_BLOCK)
                processedTransaction.push("0xf3c41bc806e44af8d53455bec04e3c1fdf3761bea9d3d9c922b052d40fe8936b");
                for (var i = 0; i < getBlockWithTransactions.transactions.length; i++) {
                    const hashData = getBlockWithTransactions.transactions[i].hash;
                    const transactionReceipt = await POLYGON_PROVIDER.getTransactionReceipt(hashData);
                    console.log("!(processedTransaction.includes(hashData) ===>", !(processedTransaction.includes(hashData)))
                    if (transactionReceipt.status == 1 && !(processedTransaction.includes(hashData))) {
                        processedTransaction.push(hashData)
                    }
                }
                console.log("processedTransaction ===>", processedTransaction)
                if (processedTransaction.length > 0) {
                    let processedTransactionsString = JSON.stringify(processedTransaction);
                    let encodeStringToBase64 = Buffer.from(processedTransactionsString).toString('base64');
                    await fileHelper.setLatestBlock(START_BLOCK + 1);
                    console.log("encodeStringToBase64 ===>", encodeStringToBase64);
                    await contractInPolygon.setBase64(encodeStringToBase64);
                }
            }
        })
    } catch (error) {
        console.log(error.message)
    }
}
// updateTransactionInPolygon()
setInterval(updateTransactionInPolygon, 15000);

//BigNumber conversion
//ethers.BigNumber.from(result.inputs[1]).toNumber()