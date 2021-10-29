'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');

const ensureAuth = async(req, res, next) => {

    if (!req.headers.authorization) return res.status(403).send({
        message: 'No tiene autorización para acceder a la información.'
    })

    const token = req.headers.authorization.replace(/['"]+/g, '');



    try {
        const payload = jwt.decode(token, process.env.secret);

        if (payload.exp <= moment().unix()) {
            return res.status(401).send({
                message: 'El token ha expirado'
            });
        } else {

            req.user = payload;
        }
    } catch (ex) {
        return res.status(404).send({
            message: 'El token no es válido'
        });
    }


    //por último llamamos al método next
    next();

}

module.exports = ensureAuth;