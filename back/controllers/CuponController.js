'use strict';

const Cupon = require('../models/cupon');

function isAdmin(req, res) {
    if (!req.user)                 { res.status(403).send({ message: 'NoAccess' }); return false; }
    if (req.user.role !== 'admin') { res.status(403).send({ message: 'NoAccess' }); return false; }
    return true;
}

function isAuth(req, res) {
    if (!req.user) { res.status(403).send({ message: 'NoAccess' }); return false; }
    return true;
}

const listar_cupones_filtro_admin = async function (req, res) {
    if (!isAdmin(req, res)) return;
    try {
        const reg = await Cupon.find({ codigo: new RegExp(req.params.filtro, 'i') });
        res.status(200).send({ data: reg });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

const listar_cupones_admin = async function (req, res) {
    if (!isAuth(req, res)) return;
    try {
        const cupones = await Cupon.find();
        res.status(200).send({ data: cupones });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

const registro_cupon_admin = async function (req, res) {
    if (!isAuth(req, res)) return;
    try {
        const reg = await Cupon.create(req.body);
        res.status(200).send({ data: reg });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

const obtener_cupon_admin = async function (req, res) {
    if (!isAuth(req, res)) return;
    try {
        const reg = await Cupon.findById(req.params.id);
        res.status(200).send({ data: reg });
    } catch (error) {
        res.status(200).send({ data: undefined });
    }
};

const actualizar_cupon_admin = async function (req, res) {
    if (!isAuth(req, res)) return;
    try {
        const { id } = req.params;
        const data   = req.body;
        const reg    = await Cupon.findByIdAndUpdate(id, {
            codigo        : data.codigo,
            tipo          : data.tipo,
            valor         : data.valor,
            limite        : data.limite,
            disponibilidad: data.disponibilidad,
        });
        res.status(200).send({ data: reg });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

const eliminar_cupon_admin = async function (req, res) {
    if (!isAuth(req, res)) return;
    try {
        const reg = await Cupon.findByIdAndRemove(req.params.id);
        res.status(200).send({ data: reg });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

const validar_cupon_admin = async function (req, res) {
    if (!isAuth(req, res)) return;
    try {
        const data = await Cupon.findOne({ codigo: req.params.cupon });
        if (!data) return res.status(200).send({ data: undefined, message: 'El cupón no existe' });
        if (data.limite === 0) return res.status(200).send({ data: undefined, message: 'Se superó el límite máximo de canjes' });
        res.status(200).send({ data });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

const validar_cupon_cliente = async function (req, res) {
    if (!isAuth(req, res)) return;
    try {
        const data = await Cupon.findOne({ codigo: req.params.cupon });
        if (!data || data.limite === 0) return res.status(200).send({ data: undefined, message: 'Cupón inválido o sin disponibilidad' });
        res.status(200).send({ data });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

module.exports = {
    registro_cupon_admin,
    listar_cupones_filtro_admin,
    listar_cupones_admin,
    obtener_cupon_admin,
    actualizar_cupon_admin,
    eliminar_cupon_admin,
    validar_cupon_admin,
    validar_cupon_cliente,
};
