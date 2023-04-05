require("dotenv").config();
const ethers = require('ethers');
const polygonAbi = require('./artifacts/contracts/UpdateTransaction.sol/UpdateTransaction.json')["abi"]
const ethereumAbi = require('./artifacts/contracts/UpdateBase64Transaction.sol/UpdateBase64Transaction.json')["abi"]

const exectuteTransactionInEthereum = async (req, res) => {
    try {
        const POLYGON_PROVIDER = new ethers.providers.JsonRpcProvider(process.env.POLYGON_PROVIDER);
        const ETHEREUM_PROVIDER = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_PROVIDER);
        const polygonWallet = new ethers.Wallet(process.env.POLYGON_TESTNET_PRIVATE_KEY, POLYGON_PROVIDER);
        const ethereumWallet = new ethers.Wallet(process.env.GOERLI_TESTNET_PRIVATE_KEY, ETHEREUM_PROVIDER);
        const contractInPolygon = new ethers.Contract(process.env.POLYGON_CONTRACT_ADDRESS, polygonAbi, polygonWallet);
        const contractInEthereum = new ethers.Contract(process.env.ETHEREUM_CONTRACT_ADDRESS, ethereumAbi, ethereumWallet);
        console.log("polygonAbi ===>", polygonAbi)
        console.log("ethereumAbi ===>", ethereumAbi)
        contractInPolygon.on("SetBase64", async (from, base64, event) => {
            let SetBase64 = {
                from: from,
                base64: base64,
                data: event,
                timestamp: Date.now()
            }
            console.log(JSON.stringify(SetBase64, null, 5))
            await contractInEthereum.setBase64(base64)
        })
    } catch (error) {
        console.log(error.message);
    }
}
exectuteTransactionInEthereum()