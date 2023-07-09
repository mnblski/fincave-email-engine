function fail(message, statusCode = 500) {
    const error = new Error(message);
    error.status = statusCode;
    throw error;
}

function sendSuccess(res, data, statusCode = 200) {
    return res
        .status(statusCode)
        .json({
            status: "success",
            data
        })
}

module.exports = {
    fail,
    sendSuccess
}