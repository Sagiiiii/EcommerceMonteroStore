'use strict';

const jwt    = require('jwt-simple');
const moment = require('moment');

const SECRET = process.env.JWT_SECRET || 'Montero2026';

/**
 * Genera un JSON Web Token (JWT) a partir de los datos del usuario.
 * @param {Object} user - Objeto de usuario con _id, nombres, apellidos, email y rol.
 * @returns {string} JWT firmado con validez de 7 días.
 */
exports.createToken = function (user) {
    const payload = {
        sub      : user._id,
        nombres  : user.nombres,
        apellidos: user.apellidos,
        email    : user.email,
        role     : user.rol,
        iat      : moment().unix(),
        exp      : moment().add(7, 'days').unix(),
    };

    return jwt.encode(payload, SECRET);
};
