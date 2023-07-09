function recursion(index, inputArr, outputArr) {
    if (index >= inputArr.length) return;

    if (Array.isArray(inputArr[index])) {
        recursion(0, inputArr[index], outputArr);
    } else {
        outputArr.push(inputArr[index]);
    }

    recursion(index + 1, inputArr, outputArr);
}

function flattenMultipart(messagePart) {
    var outputArr = [];
    recursion(0, messagePart.parts, outputArr);
    return outputArr;   
}

module.exports = { flattenMultipart };