function errorLogger(error, req, res, next) {
    console.log('error logger', error);
    next(error);
}

function errorHandler(error, req, res, next) {
    switch (error.type) {
        case 'redirect':
            return res.redirect('/error');

        case 'time-out':

            return res.status(408).send(error);

        default:
            return res
                .status(error.status || 500)
                .json({
                    message: error.message,
                    error
                });

    }
};

module.exports = {
    errorLogger,
    errorHandler
}