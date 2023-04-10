async function encodeBase64(transactionHash) {
    return new Promise((resolve, reject) => {
        var err;
        if (err) {
            reject(err);
        } else {
            let encodeBase64String = JSON.stringify(transactionHash);
            let encodedBase64 = Buffer.from(encodeBase64String).toString('base64');
            console.log("encodedBase64 ===>", encodedBase64);
            resolve(encodedBase64);
        }
    });
}

async function decodeBase64(base64) {
    return new Promise((resolve, reject) => {
        var err;
        if (err) {
            reject(err);
        } else {
            let decodeBase64 = Buffer.from(base64, 'base64').toString('utf-8');
            console.log("decodeBase64 ===>", decodeBase64);
            resolve(decodeBase64);
        }
    });
}

module.exports = {
    encodeBase64: encodeBase64,
    decodeBase64: decodeBase64
}