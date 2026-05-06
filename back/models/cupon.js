'use strict';

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const CuponSchema = Schema({
    codigo        : { type: String, required: true },
    tipo          : { type: String, required: true }, // 'porcentaje' | 'precio_fijo'
    valor         : { type: Number, required: true },
    limite        : { type: Number, required: true },
    disponibilidad: { type: Number, required: false },
    createdAt     : { type: Date, default: Date.now, required: true },
});

module.exports = mongoose.model('cupon', CuponSchema);
