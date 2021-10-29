'use strict'

const jwt = require('jwt-simple');
var moment = require('moment');

exports.CreateTokn = function(user) {
    //con este payload generaemos un token
    const payload = {
        sub: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        type_user: user.type_user,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    };

    return jwt.encode(payload, process.env.secret);
}