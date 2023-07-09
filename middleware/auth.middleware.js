const { auth } = require("../lib/firebase/main");

const verifyToken = (req, res, next) => {
    // Extract the token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1]; 

    auth.verifyIdToken(token)
        .then((decodedToken) => {
            req.uid = decodedToken.uid;;
            next();
        })
        .catch((error) => {
            // Token verification failed
            res.status(401).json({ error: 'Invalid token' }); 
        });
}

module.exports = {
    verifyToken
};