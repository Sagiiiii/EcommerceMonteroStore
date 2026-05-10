'use strict';

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const VentaSchema = Schema({
    cliente     : { type: Schema.ObjectId, ref: 'cliente',  required: true },
    nventa      : { type: String,  required: true },
    subtotal    : { type: Number,  required: true },
    envio_titulo: { type: String,  required: true },
    envio_precio: { type: Number,  required: true },
    transaccion : { type: String,  required: false, default: '' },
    cupon       : { type: String,  required: false, default: '' },
    estado      : { type: String,  required: true },
    direccion   : { type: Schema.ObjectId, ref: 'direccion', required: false },
    nota        : { type: String,  required: false },
    createdAt   : { type: Date, default: Date.now, required: true },
});

module.exports = mongoose.model('venta', VentaSchema);
