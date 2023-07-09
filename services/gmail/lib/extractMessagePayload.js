
/** 
 * All MIME types:
    text/html
    text/plain
    text/xml
    text/csv
    multipart/form-data
    multipart/mixed
    multipart/alternative
    multipart/byteranges 
    application/xml
    application/zip
    application/pdf
    application/octet-stream
 */


// function decodeBase64(base64str) {
//     return base64str.toString('base64');
// }

// const flattenMultipart = require('./flattenMultipart');
const decodeBase64 = require('./decodeBase64');

function getPartsWithin(index, inputArr, outputArr) {
    if (index >= inputArr.length) return;

    if (Array.isArray(inputArr[index]?.parts)) {
        getPartsWithin(0, inputArr[index].parts, outputArr);
    } else {
        outputArr.push(inputArr[index]);
    }

    getPartsWithin(index + 1, inputArr, outputArr);
}

function flattenMultipart(messageParts) {
    var outputArr = [];
    getPartsWithin(0, messageParts, outputArr);
    return outputArr;   
}

function htmlToPlainText(html) {
    return html.replace(/<\/?[^>]+(>|$)/g, "").replace(/\s+/g, " ")
}

// ** returns an array with message bodies DECODED
function getMessageParts(messagePayload) {
    switch (messagePayload.mimeType) {
        case 'multipart/related':
        case 'multipart/mixed':
        case 'multipart/alternative':
            // return flattenMultipart(messagePayload.parts);

            return flattenMultipart(messagePayload.parts).map(part => htmlToPlainText(decodeBase64(part.body.data)));

        case 'text/plain':
        case 'text/html':
            return [messagePayload.parts]
    }
}

// function getPartBodies(parts) {
//     switch (messagePart?.mimeType) {
//         case 'multipart/related':
//         case 'multipart/mixed':
//         case 'multipart/alternative':
//             return parts.map(part => part.body.data);
//         case 'text/plain':
//         case 'text/html':
//             return parts
//     }
// }


// function partsToPlainText(messageParts) {

//     for (let i = 0; i < messageParts.length; i++) {
//         var part = messageParts[i];

//         switch (part?.mimeType) {
//             case 'multipart/related':
//             case 'multipart/mixed':
//             case 'multipart/alternative':
//                 return parts.map(part => part.body.data);
//             case 'text/plain':
//             case 'text/html':
//                 return parts
//         }
    
//     }


function getMessageBodyAsPlainText() {

}

module.exports = {
    getMessageParts
}