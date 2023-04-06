require("dotenv").config();
const ethers = require('ethers');
const ethereumAbi = require('./artifacts/contracts/UpdateBase64Transaction.sol/UpdateBase64Transaction.json')["abi"]

const reverseBase64InEthereum = async (req, res) => {
    try {
        const ETHEREUM_PROVIDER = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_PROVIDER);
        const ethereumWallet = new ethers.Wallet(process.env.GOERLI_TESTNET_PRIVATE_KEY, ETHEREUM_PROVIDER);
        const contractInEthereum = new ethers.Contract(process.env.ETHEREUM_CONTRACT_ADDRESS, ethereumAbi, ethereumWallet);
        contractInEthereum.on("SetBase64", async (from, base64, event) => {
            let SetBase64 = {
                from: from,
                base64: base64,
                data: event,
                timestamp: Date.now()
            }
            console.log(JSON.stringify(SetBase64, null, 5))
            let encodeBase64ToString = Buffer.from(base64, 'base64').toString('utf-8');
            console.log("encodeBase64ToString ===>", encodeBase64ToString);
        })
    } catch (error) {
        console.log(error.message);
    }
}
reverseBase64InEthereum()