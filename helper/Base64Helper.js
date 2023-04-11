async function encodeBase64(transactionHash) {
    try {
        let encodeBase64String = JSON.stringify(transactionHash);
        let encodedBase64 = Buffer.from(encodeBase64String).toString('base64');
        console.log("encodedBase64 ===>", encodedBase64);
        return encodedBase64;
    } catch (error) {
        throw error;
    }
}

async function decodeBase64(base64) {
    try {
        let decodeBase64 = Buffer.from(base64, 'base64').toString('utf-8');
        console.log("decodeBase64 ===>", decodeBase64);
        return decodeBase64;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    encodeBase64: encodeBase64,
    decodeBase64: decodeBase64
}