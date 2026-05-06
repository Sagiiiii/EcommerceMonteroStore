'use strict';

const Admin    = require('../models/admin');
const Venta    = require('../models/venta');
const Dventa   = require('../models/dventa');
const Contacto = require('../models/contacto');
const bcrypt   = require('bcrypt-nodejs');
const jwt      = require('../helpers/jwt');

// ── Helper: verificar rol admin ────────────────────────
function isAdmin(req, res) {
    if (!req.user)                 { res.status(403).send({ message: 'NoAccess' }); return false; }
    if (req.user.role !== 'admin') { res.status(403).send({ message: 'NoAccess' }); return false; }
    return true;
}

// ── Helper: parsear fechas para filtros KPI ────────────
function parsearRangoFechas(data) {
    const currentYear = new Date().getFullYear();
    const inicio = data.fecha_ini ? new Date(data.fecha_ini) : new Date(`${currentYear}-01-01`);
    const fin    = data.fecha_fin ? new Date(data.fecha_fin) : new Date(`${currentYear}-12-31`);
    return { inicio, fin };
}

// ──────────────────────────────────────────────────────
// AUTH
// ──────────────────────────────────────────────────────

const registro_admin = async function (req, res) {
    try {
        const data      = req.body;
        const existe    = await Admin.find({ email: data.email });

        if (existe.length > 0) {
            return res.status(200).send({ message: 'El correo ya existe en la base de datos', data: undefined });
        }
        if (!data.password) {
            return res.status(200).send({ message: 'No hay una contraseña', data: undefined });
        }

        bcrypt.hash(data.password, null, null, async function (err, hash) {
            if (!hash) return res.status(500).send({ message: 'Error de Servidor', data: undefined });
            data.password = hash;
            data.rol      = 'admin';
            const reg = await Admin.create(data);
            res.status(200).send({ data: reg });
        });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

const login_admin = async function (req, res) {
    try {
        const data      = req.body;
        const admin_arr = await Admin.find({ email: data.email });

        if (admin_arr.length === 0) {
            return res.status(200).send({ message: 'No se encontró el correo', data: undefined });
        }

        const user = admin_arr[0];
        bcrypt.compare(data.password, user.password, function (error, check) {
            if (!check) return res.status(200).send({ message: 'La contraseña no coincide', data: undefined });
            res.status(200).send({ data: user, token: jwt.createToken(user) });
        });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

// ──────────────────────────────────────────────────────
// PERFIL ADMIN
// ──────────────────────────────────────────────────────

const obtener_admin = async function (req, res) {
    if (!isAdmin(req, res)) return;
    try {
        const reg = await Admin.findById(req.params.id);
        res.status(200).send({ data: reg });
    } catch (error) {
        res.status(200).send({ data: undefined });
    }
};

const actualizar_perfil_admin = async function (req, res) {
    if (!isAdmin(req, res)) return;

    const id   = req.params.id;
    const data = req.body;

    const campos = {
        nombres  : data.nombres,
        apellidos: data.apellidos,
        email    : data.email,
        telefono : data.telefono,
        dni      : data.dni,
        rol      : data.rol,
    };

    if (data.password) {
        bcrypt.hash(data.password, null, null, async function (err, hash) {
            campos.password = hash;
            const reg = await Admin.findByIdAndUpdate(id, campos);
            res.status(200).send({ data: reg });
        });
    } else {
        const reg = await Admin.findByIdAndUpdate(id, campos);
        res.status(200).send({ data: reg });
    }
};

// ──────────────────────────────────────────────────────
// MENSAJES / CONTACTO
// ──────────────────────────────────────────────────────

const obtener_mensaje_admin = async function (req, res) {
    if (!isAdmin(req, res)) return;
    const reg = await Contacto.find().sort({ createdAt: -1 });
    res.status(200).send({ data: reg });
};

const cerrar_mensaje_admin = async function (req, res) {
    if (!isAdmin(req, res)) return;
    const reg = await Contacto.findByIdAndUpdate(req.params.id, { estado: 'Cerrado' });
    res.status(200).send({ data: reg });
};

// ──────────────────────────────────────────────────────
// VENTAS
// ──────────────────────────────────────────────────────

const obtener_ventas_admin = async function (req, res) {
    if (!isAdmin(req, res)) return;

    const desde = req.params.desde;
    const hasta = req.params.hasta;

    if (desde === 'undefined' || hasta === 'undefined' || !desde || !hasta) {
        const ventas = await Venta.find()
            .populate('cliente')
            .populate('direccion')
            .sort({ createdAt: -1 });
        return res.status(200).send({ data: ventas });
    }

    const tt_desde   = Date.parse(`${desde}T00:00:00`) / 1000;
    const tt_hasta   = Date.parse(`${hasta}T00:00:00`) / 1000;
    const tem_ventas = await Venta.find()
        .populate('cliente')
        .populate('direccion')
        .sort({ createdAt: -1 });

    const ventas = tem_ventas.filter(item => {
        const tt = Date.parse(new Date(item.createdAt)) / 1000;
        return tt >= tt_desde && tt <= tt_hasta;
    });

    res.status(200).send({ data: ventas });
};

// ──────────────────────────────────────────────────────
// KPI — GANANCIAS MENSUALES
// ──────────────────────────────────────────────────────

const kpi_ganancias_mensuales_admin = async function (req, res) {
    if (!isAdmin(req, res)) return;

    // Acumuladores por mes (índice 0 = enero, 11 = diciembre)
    const totales_mes = new Array(12).fill(0);

    const current_date  = new Date();
    const current_year  = current_date.getFullYear();
    const current_month = current_date.getMonth() + 1;

    let total_ganancia      = 0;
    let total_ganancia_mes  = 0;
    let count_ventas_mes    = 0;
    let total_mes_anterior  = 0;

    const ventas = await Venta.find();

    for (const item of ventas) {
        const fecha = new Date(item.createdAt);
        if (fecha.getFullYear() !== current_year) continue;

        const mes = fecha.getMonth() + 1;
        total_ganancia          += item.subtotal;
        totales_mes[mes - 1]    += item.subtotal;

        if (mes === current_month) {
            total_ganancia_mes += item.subtotal;
            count_ventas_mes   += 1;
        }
        if (mes === current_month - 1) {
            total_mes_anterior += item.subtotal;
        }
    }

    const nombres_mes = ['enero','febrero','marzo','abril','mayo','junio',
                         'julio','agosto','septiembre','octubre','noviembre','diciembre'];

    const respuesta = { total_ganancia, total_ganancia_mes, count_ventas_porcent: count_ventas_mes,
                        total_mes_anterior, meses: current_month, mes_anterior: current_month - 1 };

    nombres_mes.forEach((nombre, i) => { respuesta[nombre] = totales_mes[i]; });

    res.status(200).send(respuesta);
};

// ──────────────────────────────────────────────────────
// KPI — GANANCIAS DIARIAS
// ──────────────────────────────────────────────────────

const kpi_ganancias_diaria_admin = async function (req, res) {
    if (!isAdmin(req, res)) return;

    const nombres_dia = ['domingo','lunes','martes','miercoles','jueves','viernes','sabado'];
    const totales_dia = new Array(7).fill(0);

    const current_date  = new Date();
    const current_year  = current_date.getFullYear();
    const current_month = current_date.getMonth() + 1;
    const current_day   = current_date.getDay();

    let total_ganancia     = 0;
    let total_ganancia_day = 0;
    let count_ventas_day   = 0;

    const ventas = await Venta.find();

    for (const item of ventas) {
        const fecha = new Date(item.createdAt);
        if (fecha.getFullYear() !== current_year) continue;
        if (fecha.getMonth() + 1 !== current_month) continue;

        const day = fecha.getDay();
        total_ganancia    += item.subtotal;
        totales_dia[day]  += item.subtotal;

        if (day === current_day) {
            total_ganancia_day += item.subtotal;
            count_ventas_day   += 1;
        }
    }

    const respuesta = { total_ganancia, total_ganancia_day, count_ventas_porcent: count_ventas_day };
    nombres_dia.forEach((nombre, i) => { respuesta[nombre] = totales_dia[i]; });

    res.status(200).send(respuesta);
};

// ──────────────────────────────────────────────────────
// KPI — MEJORES CLIENTES
// ──────────────────────────────────────────────────────

const kpi_mejores_cliente = async function (req, res) {
    if (!isAdmin(req, res)) return;

    const { inicio, fin } = parsearRangoFechas(req.query);

    const ventas = await Venta.find({ createdAt: { $gte: inicio, $lte: fin } }).populate('cliente');

    const mapa = {};
    ventas.forEach(venta => {
        if (!venta.cliente) return;
        const id = venta.cliente._id.toString();
        if (mapa[id]) {
            mapa[id].cantidad += venta.subtotal;
        } else {
            mapa[id] = { cliente: venta.cliente, cantidad: venta.subtotal };
        }
    });

    const ordenados = Object.values(mapa).sort((a, b) => b.cantidad - a.cantidad);
    res.status(200).send({ data: ordenados });
};

// ──────────────────────────────────────────────────────
// KPI — MEJORES PRODUCTOS
// ──────────────────────────────────────────────────────

const kpi_mejores_items = async function (req, res) {
    if (!isAdmin(req, res)) return;

    const { inicio, fin } = parsearRangoFechas(req.query);

    const dventas = await Dventa.find({ createdAt: { $gte: inicio, $lte: fin } }).populate('producto');

    const mapa = {};
    dventas.forEach(dventa => {
        if (!dventa.producto || !dventa.producto._id) return;
        const id = dventa.producto._id.toString();
        if (mapa[id]) {
            mapa[id].cantidad += dventa.subtotal; // ✅ Corregido: era venta.subtotal (bug original)
        } else {
            mapa[id] = { producto: dventa.producto, cantidad: dventa.subtotal };
        }
    });

    const ordenados = Object.values(mapa).sort((a, b) => b.cantidad - a.cantidad);
    res.status(200).send({ data: ordenados });
};

// ──────────────────────────────────────────────────────

module.exports = {
    registro_admin,
    login_admin,
    obtener_admin,
    actualizar_perfil_admin,
    obtener_mensaje_admin,
    cerrar_mensaje_admin,
    obtener_ventas_admin,
    kpi_ganancias_mensuales_admin,
    kpi_ganancias_diaria_admin,
    kpi_mejores_cliente,
    kpi_mejores_items,
};
