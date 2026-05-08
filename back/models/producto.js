'use strict';

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const ProductoSchema = Schema({
    titulo          : { type: String, required: true },
    slug            : { type: String, required: true },
    galeria         : [{ type: Object, required: false }],
    portada         : { type: String, required: true },
    precio          : { type: Number, required: true },
    descripcion     : { type: String, required: true },
    contenido       : { type: String, required: true },
    stock           : { type: Number, required: true },
    nventas         : { type: Number, default: 0, required: true },
    npuntos         : { type: Number, default: 0, required: true },
    variedades      : [{ type: Object, required: false }],
    titulo_variedad : { type: String, required: false },
    categoria       : { type: String, required: true },
    estado          : { type: String, default: 'edicion', required: true },
    almacen         : { type: String, enum: ['huancayo', 'ayacucho'], default: 'huancayo', required: true },
    createdAt       : { type: Date, default: Date.now, required: true },
});

module.exports = mongoose.model('producto', ProductoSchema);
