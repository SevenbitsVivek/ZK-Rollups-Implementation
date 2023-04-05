const fs = require('fs');
const axios = require('axios');
require("dotenv").config();
const crypto = require("crypto");
const ethers = require('ethers');
const fileHelper = require('./helper/fileHelper.js');
const InputDataDecoder = require('ethereum-input-data-decoder');
const polygonAbi = require('./artifacts/contracts/UpdateTransaction.sol/UpdateTransaction.json')["abi"]

const updateTransactionInPolygon = async (req, res) => {
    try {
        var START_BLOCK
        const END_BLOCK = "99999999"
        const POLYGON_PROVIDER = new ethers.providers.JsonRpcProvider(process.env.POLYGON_PROVIDER);
        const polygonWallet = new ethers.Wallet(process.env.POLYGON_TESTNET_PRIVATE_KEY, POLYGON_PROVIDER);
        const contractInPolygon = new ethers.Contract(process.env.POLYGON_CONTRACT_ADDRESS, polygonAbi, polygonWallet);
        var processedTransaction = []
        let processedTransactions = new Set();
        fs.readFile("deposit.json", async function (err, data) {
            if (err) throw err;
            const users = JSON.parse(data);
            START_BLOCK = users
            let transactionResponse = await axios({
                url: `https://api-testnet.polygonscan.com/api?module=account&action=txlist&address=${process.env.POLYGON_CONTRACT_ADDRESS}&startblock=${START_BLOCK}&endblock=${END_BLOCK}&sort=asc&apikey=${process.env.NETWORK_API_KEY}`,
                headers: { "Accept-Encoding": "gzip,deflate,compress" },
                method: "GET",
            })
            console.log("START_BLOCK ===>", START_BLOCK)
            for (var i = 0; i < transactionResponse.data.result.length; i++) {
                const hashData = transactionResponse.data.result[i].hash;
                const inputData = transactionResponse.data.result[i].input;
                const decoder = new InputDataDecoder(polygonAbi);
                const inputResult = decoder.decodeData(inputData);
                if (transactionResponse.data.result[i].blockNumber > START_BLOCK) {
                    if (transactionResponse.data.result[i].txreceipt_status == 1) {
                        if (inputResult.method == "set") {
                            let eventFilter = contractInPolygon.filters.SetNumber()
                            let events = await contractInPolygon.queryFilter(eventFilter)
                            if (events) {
                                processedTransactions.add(hashData)
                                processedTransaction.push({ data: hashData })
                                await fileHelper.setLatestBlock(transactionResponse.data.result[i].blockNumber);
                            }
                        }
                    }
                }
            }
            console.log("processedTransaction ===>", processedTransaction)
            console.log("processedTransactions ===>", processedTransactions)
            if (processedTransactions.size > 0) {
                const finalHash = crypto
                    .createHash("sha1")
                    .update(processedTransaction.join('')) // join array elements into a single string
                    .digest("base64");
                console.log("finalHash ===>", finalHash)
                // await contractInPolygon.setBase64(finalHash);
            }
        })
    } catch (error) {
        console.log(error.message)
    }
}
updateTransactionInPolygon()

//BigNumber conversion
//ethers.BigNumber.from(result.inputs[1]).toNumber()