'use strict';

const jwt    = require('jwt-simple');
const moment = require('moment');

const SECRET = process.env.JWT_SECRET || 'Montero2026';

/**
 * Middleware que verifica el JWT enviado en el header Authorization.
 * Si el token es válido, adjunta el payload decodificado en req.user.
 */
exports.auth = function (req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'NoHeadersError' });
    }

    const token    = req.headers.authorization.replace(/['"]+/g, '');
    const segments = token.split('.');

    if (segments.length !== 3) {
        return res.status(403).send({ message: 'InvalidToken' });
    }

    try {
        const payload = jwt.decode(token, SECRET);

        if (payload.exp <= moment().unix()) {
            return res.status(403).send({ message: 'TokenExpirado' });
        }

        req.user = payload;
        next();
    } catch (error) {
        return res.status(403).send({ message: 'InvalidToken' });
    }
};
