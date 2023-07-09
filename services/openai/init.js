
require('dotenv').config();

const { Configuration, OpenAIApi } = require("openai");
let openaiInstance = null;

async function initOpenAI() {
    if (!openaiInstance) {
        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        openaiInstance = new OpenAIApi(configuration);
    }
}

(async() => {
    await initOpenAI();
    console.log('open ai success init');
})();

module.exports = { openaiInstance };



