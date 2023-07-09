require('dotenv').config();

const { google } = require('googleapis');
const { ImapFlow } = require('imapflow');
const express = require('express');
const axios = require('axios');

const app = express();

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://mail.google.com/'];

async function getAuthenticatedClient() {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_OUATH_CLIENT_ID,
      process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      process.env.GOOGLE_OUATH_CLIENT_REDIRECT_URI
    );
  
    const authorizeUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
  
    console.log('Authorize this app by visiting this url:', authorizeUrl);
  }
  
  (async () => {
    const gmail = await getAuthenticatedClient();
    console.log('gmail', gmail);
  })();

app.get('/auth/google/callback', async (req, res) => {
    const authorizationCode = req.query.code;

    const params = new URLSearchParams();
    params.append('code', authorizationCode);
    params.append('client_id', process.env.GOOGLE_OUATH_CLIENT_ID);
    params.append('client_secret', process.env.GOOGLE_OAUTH_CLIENT_SECRET);
    params.append('redirect_uri', process.env.GOOGLE_OUATH_CLIENT_REDIRECT_URI);
    params.append('grant_type', 'authorization_code');

    console.log('params', params);

    axios.post('https://oauth2.googleapis.com/token', params)
      .then(async (response) => {
        const accessToken = response.data.access_token;
        const refreshToken = response.data.refresh_token;
        const expiresIn = response.data.expires_in;
        console.log('Access token:', accessToken);
        console.log('Refresh token:', refreshToken);
        console.log('Expires in:', expiresIn);
        // do something with the tokens, e.g. store them in a database

        const client = new ImapFlow({
          host: process.env.GMAIL_IMAP_HOST,
          port: process.env.GMAIL_IMAP_PORT,
          secure: true,
          auth: { user: process.env.GMAIL_USER, accessToken: accessToken}
        });

        // Wait until client connects and authorizes
        await client.connect();

        // Select and lock a mailbox. Throws if mailbox does not exist
        let lock = await client.getMailboxLock('INBOX');
        try {
            // fetch latest message source
            // client.mailbox includes information about currently selected mailbox
            // "exists" value is also the largest sequence number available in the mailbox
            let message = await client.fetchOne(client.mailbox.exists, { source: true });
            console.log(message.source.toString());

            // list subjects for all messages
            // uid value is always included in FETCH response, envelope strings are in unicode.
            for await (let message of client.fetch('1:*', { envelope: true })) {
                console.log(`${message.uid}: ${message.envelope.subject}`);
            }
        } finally {
            // Make sure lock is released, otherwise next `getMailboxLock()` never returns
            lock.release();
        }

        await client.logout();
      })
      .catch(error => {
        console.error(error);
        res.status(500).send('Error receiving access token');
      });
    

    res.send('Hello, world!');
});
