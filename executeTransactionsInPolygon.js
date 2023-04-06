require("dotenv").config();
const ethers = require('ethers');
const polygonAbi = require('./artifacts/contracts/UpdateTransaction.sol/UpdateTransaction.json')["abi"]

const exectuteTransactionInPolygon = async (req, res) => {
    try {
        const POLYGON_PROVIDER = new ethers.providers.JsonRpcProvider(process.env.POLYGON_PROVIDER);
        const polygonWallet = new ethers.Wallet(process.env.POLYGON_TESTNET_PRIVATE_KEY, POLYGON_PROVIDER);
        const contractInPolygon = new ethers.Contract(process.env.POLYGON_CONTRACT_ADDRESS, polygonAbi, polygonWallet);
        for (let i = 1; i <= 10; i++) {
            const transactionResponse = await contractInPolygon.set(i)
        }
    } catch (error) {
        console.log(error.message);
    }
}
exectuteTransactionInPolygon()