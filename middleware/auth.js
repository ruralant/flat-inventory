var User = require('./../models/userModel');

var authenticate = (req, res, next) => {
    var token = req.header('x-auth') || req.session.accessToken;
    User.findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject();
        }
        req.token = token;
        next();
    }).catch((e) => {
        res.status(400).send({
            message: "No authenticated"
        });
    });
};

var adminAuth = (req, res, next) => {
    var role = req.session.user.userType;

    if (role === 'admin') {
        next();
    } else {
        res.status(400).send({
            message: "No permissions"
        });
    }
};

module.exports = {
    authenticate,
    adminAuth
};