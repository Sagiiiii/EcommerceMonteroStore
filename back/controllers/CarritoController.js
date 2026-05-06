'use strict';

const Carrito = require('../models/carrito');

const agregar_carrito_cliente = async function (req, res) {
    if (!req.user) return res.status(403).send({ message: 'NoAccess' });

    try {
        const data            = req.body;
        const carrito_cliente = await Carrito.find({ cliente: data.cliente, producto: data.producto });

        if (carrito_cliente.length > 0) {
            return res.status(200).send({ data: undefined, message: 'El producto ya existe en el carrito' });
        }

        const reg = await Carrito.create(data);
        res.status(200).send({ data: reg });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

const obtener_carrito_cliente = async function (req, res) {
    if (!req.user) return res.status(403).send({ message: 'NoAccess' });

    try {
        const carrito = await Carrito.find({ cliente: req.params.id }).populate('producto');
        res.status(200).send({ data: carrito });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

const eliminar_carrito_cliente = async function (req, res) {
    if (!req.user) return res.status(403).send({ message: 'NoAccess' });

    try {
        const reg = await Carrito.findByIdAndRemove(req.params.id);
        res.status(200).send({ data: reg });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

module.exports = {
    agregar_carrito_cliente,
    obtener_carrito_cliente,
    eliminar_carrito_cliente,
};
