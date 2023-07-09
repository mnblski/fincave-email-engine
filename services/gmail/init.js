const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
const { extractPurchaseDataAI } = require('../openai/lib/extractPurchaseDataAI');
const { getMessageParts } = require('./lib/extractMessagePayload');
const e = require('express');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.

// ?  process.cwd() - returns the current working directory of the Node.js process
// ? path.join() - joins all given path segments together using the platform-specific separator as a delimiter, then normalizes the resulting path.
// ? path.join(process.cwd(), './gmail/token.json') - returns the current working directory of the Node.js process + /gmail/token.json
// ? fs - file system module
// ? fs.writeFile() - writes data to a file, replacing the file if it already exists. data can be a string or a buffer.
// ? fs.readFile() - reads the entire contents of a file. data can be a string or a buffer.
const TOKEN_PATH = path.join(process.cwd(), './gmail/token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), './gmail/credentials.json');


/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}


/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listLabels(auth) {
  const gmail = google.gmail({version: 'v1', auth});

  try {
    const messagesPage = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 1
    })

    console.log('messagesPage', messagesPage.data.messages);

    if (messagesPage.data?.messages?.length) {

      for (let i = 0; i < messagesPage.data.messages.length; i++) {
        const message = messagesPage.data.messages[i];

        console.log('message', message)

        const m = await gmail.users.messages.get({
          userId: 'me',
          id: message.id,
        })

        console.log('m', m.data);
        // console.log('headers', m.data.payload.headers);
        // console.log('body', m.data.payload.body);
        // console.log('parts', m.data.payload.parts);

        console.log('ALL PARTS', getMessageParts(m.data.payload));


        // onMessageChange

        // check if an event was new message was created

        // check if this is an order confirmation email

        // run handlePurchaseEmail 
            // extractPurchaseDataAI
            // run product logic
            // create order data (inc. product data)
            // create asset data based on the order data
            // update UI with new entities


        const test = await extractPurchaseDataAI(getMessageParts(m.data.payload))


      


        return test;


      }
    }
    
  } catch (error) {
      console.log('err', error);
  }

    
    // const lastMessage = await gmail.users.messages.get({
    //     userId: 'me',
    //     id: messages.data.messages[0].id,
    // })

    // for (let i = 0; i < lastMessage.data.payload.parts.length; i++) {
    //     var part = lastMessage.data.payload.parts[i];


    //     switch (part?.mimeType) {
    //         case 'multipart/related':
    //         case 'multipart/mixed':
    //         case 'multipart/alternative':

    //          for (let i = 0; i < part.parts.length; i++) {
    //             var subPart = part.parts[i];

    //             switch (subPart?.mimeType) {
    //                 case 'text/plain':
    //                     // console.log('subPart - text/plain', decodeBase64(subPart.body.data));
    //                     break;
        
    //                 case 'text/html':
    //                     // console.log('subPart - SHOULD HAVEN OT WHITE SPACE', decodeBase64(subPart.body.data).replace(/<\/?[^>]+(>|$)/g, "").replace(/\s+/g, " "));
    //                     await extractPurchaseDataAI(decodeBase64(subPart.body.data).replace(/<\/?[^>]+(>|$)/g, "").replace(/\s+/g, " "));
    //                     break;
    //             }
    //          }

    //         case 'text/plain':
    //             if (part.body.data) {
    //                 // console.log('part - text/plain', decodeBase64(part.body.data));
    //             }
    //             break;

    //         case 'text/html':
    //             if (part.body.data) {
    //                 // ? replace(/<\/?[^>]+(>|$)/g, "") - removes all html tags
    //                 // ? replace(/\s\s+/g, ' ') - removes all extra spaces and live only single space
    //                 // console.log('part - text/html', decodeBase64(part.body.data))
    //                 // console.log('text/html', decodeBase64(part.body.data).replace(/<\/?[^>]+(>|$)/g, "").replace(/\s+/g, ''));
    //             }
    //             break;
    //     }
    // }
}

authorize().then(listLabels).catch(console.error);