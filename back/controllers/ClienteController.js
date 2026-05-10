'use strict';

const Cliente  = require('../models/cliente');
const Venta    = require('../models/venta');
const Review   = require('../models/review');
const Dventa   = require('../models/dventa');
const Contacto = require('../models/contacto');
const Direccion= require('../models/direccion');
const bcrypt   = require('bcrypt-nodejs');
const jwt      = require('../helpers/jwt');

// ── Helper: verificar autenticación ───────────────────
function isAuth(req, res) {
    if (!req.user) { res.status(403).send({ message: 'NoAccess' }); return false; }
    return true;
}

// ── Helper: verificar rol admin ────────────────────────
function isAdmin(req, res) {
    if (!req.user)                 { res.status(403).send({ message: 'NoAccess' }); return false; }
    if (req.user.role !== 'admin') { res.status(403).send({ message: 'NoAccess' }); return false; }
    return true;
}

// ──────────────────────────────────────────────────────
// AUTH CLIENTE
// ──────────────────────────────────────────────────────

const registro_cliente = async function (req, res) {
    try {
        const data   = req.body;
        const existe = await Cliente.find({ email: data.email });

        if (existe.length > 0) {
            return res.status(200).send({ message: 'El correo ya existe en la base de datos', data: undefined });
        }
        if (!data.password) {
            return res.status(200).send({ message: 'No hay una contraseña', data: undefined });
        }

        bcrypt.hash(data.password, null, null, async function (err, hash) {
            if (!hash) return res.status(500).send({ message: 'Error de Servidor', data: undefined });
            data.password = hash;
            const reg = await Cliente.create(data);
            res.status(200).send({ data: reg });
        });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

const login_cliente = async function (req, res) {
    try {
        const data       = req.body;
        const cliente_arr = await Cliente.find({ email: data.email });

        if (cliente_arr.length === 0) {
            return res.status(200).send({ message: 'No se encontró el correo', data: undefined });
        }

        const user = cliente_arr[0];
        bcrypt.compare(data.password, user.password, function (error, check) {
            if (!check) return res.status(200).send({ message: 'La contraseña no coincide', data: undefined });
            res.status(200).send({ data: user, token: jwt.createToken(user) });
        });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

// ──────────────────────────────────────────────────────
// GESTIÓN CLIENTES (ADMIN)
// ──────────────────────────────────────────────────────

const listar_clientes_filtro_admin = async function (req, res) {
    if (!isAdmin(req, res)) return;

    const tipo   = req.params.tipo;
    const filtro = req.params.filtro;

    if (!tipo || tipo === 'null') {
        const reg = await Cliente.find();
        return res.status(200).send({ data: reg });
    }

    const campoBusqueda = tipo === 'correo' ? 'email' : tipo;
    const reg = await Cliente.find({ [campoBusqueda]: new RegExp(filtro, 'i') });
    res.status(200).send({ data: reg });
};

const registro_cliente_admin = async function (req, res) {
    if (!isAdmin(req, res)) return;

    const data = req.body;
    bcrypt.hash('123456789', null, null, async function (err, hash) {
        if (!hash) return res.status(500).send({ message: 'Error de Servidor', data: undefined });
        data.password = hash;
        const reg = await Cliente.create(data);
        res.status(200).send({ data: reg });
    });
};

const obtener_cliente_admin = async function (req, res) {
    if (!isAdmin(req, res)) return;
    try {
        const reg = await Cliente.findById(req.params.id);
        res.status(200).send({ data: reg });
    } catch (error) {
        res.status(200).send({ data: undefined });
    }
};

const actualizar_cliente_admin = async function (req, res) {
    if (!isAdmin(req, res)) return;

    const { id }   = req.params;
    const data     = req.body;

    const reg = await Cliente.findByIdAndUpdate(id, {
        nombres      : data.nombres,
        apellidos    : data.apellidos,
        email        : data.email,
        telefono     : data.telefono,
        f_nacimiento : data.f_nacimiento,
        dni          : data.dni,
        genero       : data.genero,
        localidad    : data.localidad || 'Huancayo',
    });
    res.status(200).send({ data: reg });
};

const eliminar_cliente_admin = async function (req, res) {
    if (!isAdmin(req, res)) return;
    const reg = await Cliente.findByIdAndRemove(req.params.id);
    res.status(200).send({ data: reg });
};

// ──────────────────────────────────────────────────────
// PERFIL CLIENTE (ECOMMERCE)
// ──────────────────────────────────────────────────────

const obtener_cliente_guest = async function (req, res) {
    if (!isAuth(req, res)) return;
    try {
        const reg = await Cliente.findById(req.params.id);
        res.status(200).send({ data: reg });
    } catch (error) {
        res.status(200).send({ data: undefined });
    }
};

const actualizar_perfil_cliente_guest = async function (req, res) {
    if (!isAuth(req, res)) return;

    const id   = req.params.id;
    const data = req.body;

    const campos = {
        nombres      : data.nombres,
        apellidos    : data.apellidos,
        telefono     : data.telefono,
        f_nacimiento : data.f_nacimiento,
        dni          : data.dni,
        genero       : data.genero,
        pais         : data.pais,
    };

    if (data.password) {
        bcrypt.hash(data.password, null, null, async function (err, hash) {
            campos.password = hash;
            const reg = await Cliente.findByIdAndUpdate(id, campos);
            res.status(200).send({ data: reg });
        });
    } else {
        const reg = await Cliente.findByIdAndUpdate(id, campos);
        res.status(200).send({ data: reg });
    }
};

// ──────────────────────────────────────────────────────
// DIRECCIONES
// ──────────────────────────────────────────────────────

const registro_direccion_cliente = async function (req, res) {
    if (!isAuth(req, res)) return;

    try {
        const data = req.body;

        if (data.principal) {
            const direcciones = await Direccion.find({ cliente: data.cliente });
            await Promise.all(
                direcciones.map(d => Direccion.findByIdAndUpdate(d._id, { principal: false }))
            );
        }

        const reg = await Direccion.create(data);
        res.status(200).send({ data: reg });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

const obtener_direccion_todos_cliente = async function (req, res) {
    if (!isAuth(req, res)) return;
    const direcciones = await Direccion.find({ cliente: req.params.id })
        .populate('cliente')
        .sort({ createdAt: -1 });
    res.status(200).send({ data: direcciones });
};

const cambiar_direccion_principal_cliente = async function (req, res) {
    if (!isAuth(req, res)) return;

    try {
        const { id, cliente } = req.params;
        const direcciones     = await Direccion.find({ cliente });

        await Promise.all(
            direcciones.map(d => Direccion.findByIdAndUpdate(d._id, { principal: false }))
        );
        await Direccion.findByIdAndUpdate(id, { principal: true });

        res.status(200).send({ data: true });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

const obtener_direccion_principal_cliente = async function (req, res) {
    if (!isAuth(req, res)) return;
    const direccion = await Direccion.findOne({ cliente: req.params.id, principal: true });
    res.status(200).send({ data: direccion || undefined });
};

// ──────────────────────────────────────────────────────
// CONTACTO
// ──────────────────────────────────────────────────────

const enviar_mensaje_contacto = async function (req, res) {
    try {
        const data  = { ...req.body, estado: 'Abierto' };
        const reg   = await Contacto.create(data);
        res.status(200).send({ data: reg });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

// ──────────────────────────────────────────────────────
// ÓRDENES
// ──────────────────────────────────────────────────────

const obtener_ordenes_cliente = async function (req, res) {
    if (!isAuth(req, res)) return;

    try {
        const reg = await Venta.find({ cliente: req.params.id }).sort({ createdAt: -1 });
        res.status(200).send({ data: reg.length > 0 ? reg : undefined });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

const obtener_ordenes_detalle_cliente = async function (req, res) {
    if (!isAuth(req, res)) return;

    try {
        const id      = req.params.id;
        const venta   = await Venta.findById(id).populate('direccion').populate('cliente');
        const detalles = await Dventa.find({ venta: id }).populate('producto');
        res.status(200).send({ data: venta, detalles });
    } catch (error) {
        res.status(200).send({ data: undefined });
    }
};

// ──────────────────────────────────────────────────────
// REVIEWS
// ──────────────────────────────────────────────────────

const emitir_review_producto_cliente = async function (req, res) {
    if (!isAuth(req, res)) return;
    try {
        const reg = await Review.create(req.body);
        res.status(200).send({ data: reg });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

const obtener_review_producto_cliente = async function (req, res) {
    try {
        const reg = await Review.find({ producto: req.params.id }).sort({ createdAt: -1 });
        res.status(200).send({ data: reg });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

const obtener_review_cliente = async function (req, res) {
    if (!isAuth(req, res)) return;
    try {
        const reg = await Review.find({ cliente: req.params.id }).populate('cliente');
        res.status(200).send({ data: reg });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

// ──────────────────────────────────────────────────────

module.exports = {
    // Auth
    registro_cliente,
    login_cliente,
    // Admin
    listar_clientes_filtro_admin,
    registro_cliente_admin,
    obtener_cliente_admin,
    actualizar_cliente_admin,
    eliminar_cliente_admin,
    // Perfil ecommerce
    obtener_cliente_guest,
    actualizar_perfil_cliente_guest,
    // Direcciones
    registro_direccion_cliente,
    obtener_direccion_todos_cliente,
    cambiar_direccion_principal_cliente,
    obtener_direccion_principal_cliente,
    // Contacto
    enviar_mensaje_contacto,
    // Órdenes
    obtener_ordenes_cliente,
    obtener_ordenes_detalle_cliente,
    // Reviews
    emitir_review_producto_cliente,
    obtener_review_producto_cliente,
    obtener_review_cliente,
};
