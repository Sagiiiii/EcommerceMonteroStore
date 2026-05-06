'use strict';

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const DventaSchema = Schema({
    producto : { type: Schema.ObjectId, ref: 'producto', required: true },
    venta    : { type: Schema.ObjectId, ref: 'venta',    required: true },
    cliente  : { type: Schema.ObjectId, ref: 'cliente',  required: true },
    subtotal : { type: Number, required: true },
    variedad : { type: String, required: true },
    cantidad : { type: Number, required: true },
    createdAt: { type: Date, default: Date.now, required: true },
});

module.exports = mongoose.model('dventa', DventaSchema);
