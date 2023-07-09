module.exports = function decodeBase64(base64str) {
    const buffer = Buffer.from(base64str, 'base64');
    return buffer.toString('utf8');
}