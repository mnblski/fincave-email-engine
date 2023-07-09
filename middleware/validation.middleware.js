/**
 * ADD VALIDATION HELPER FUNCTION THAT FORMATS THE ERROR RESPONSE
 * how to return error? should I create new error instance? or just a message
 * function that return another function
 * */

/**
 *  crete wrapper functions for fail or success to have a consistent API
 *  e.g. fail always returns status code and a message, success false OR response ok
 *  e.g. success always returns status code, data as json and success: 'true'
 * */

const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.validateAsync(req.body);
            next();

        } catch (err) {
            err.type = 'validation'
            next(err);
        }
    }
}

module.exports = {
    validate
};