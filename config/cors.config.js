module.exports = {
    origin: process.env.CLIENT_ORIGIN, // CLIENT URL
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}