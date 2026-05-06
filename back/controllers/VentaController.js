'use strict';

const Venta       = require('../models/venta');
const Dventa      = require('../models/dventa');
const Producto    = require('../models/producto');
const Carrito     = require('../models/carrito');
const fs          = require('fs');
const handlebars  = require('handlebars');
const ejs         = require('ejs');
const nodemailer  = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const path        = require('path');

// ── Helper: rellena con ceros a la izquierda ───────────
function zfill(number, width) {
    const abs = Math.abs(number);
    const str = abs.toString();
    const pad = width > str.length ? '0'.repeat(width - str.length) : '';
    return (number < 0 ? '-' : '') + pad + str;
}

// ── Helper: genera el siguiente número de venta ────────
async function generarNventa() {
    const ultima = await Venta.find().sort({ createdAt: -1 }).limit(1);

    if (ultima.length === 0) return '001-000001';

    const [serie, correlativo] = ultima[0].nventa.split('-');

    if (correlativo !== '999999') {
        return `${serie}-${zfill(parseInt(correlativo) + 1, 6)}`;
    } else {
        return `${zfill(parseInt(serie) + 1, 3)}-000001`;
    }
}

// ── Helper: leer archivo HTML ──────────────────────────
function leerHTML(ruta) {
    return new Promise((resolve, reject) => {
        fs.readFile(ruta, { encoding: 'utf-8' }, (err, html) => {
            if (err) reject(err);
            else resolve(html);
        });
    });
}

// ──────────────────────────────────────────────────────
// REGISTRO DE COMPRA
// ──────────────────────────────────────────────────────

const registro_compra_cliente = async function (req, res) {
    if (!req.user) return res.status(403).send({ message: 'NoAccess' });

    try {
        const data       = req.body;
        const detalles   = data.detalles;
        const metodoPago = data.metodoPago;

        data.nventa = await generarNventa();
        data.estado = metodoPago === 'cash' ? 'Pendiente Cobro' : 'Procesando';

        const venta = await Venta.create(data);

        // Procesar cada ítem del pedido en paralelo
        await Promise.all(detalles.map(async element => {
            element.venta        = venta._id;
            await Dventa.create(element);

            const prod     = await Producto.findById(element.producto);
            const newStock = prod.stock - element.cantidad;
            await Producto.findByIdAndUpdate(element.producto, { stock: newStock });
        }));

        // Limpiar carrito del cliente
        await Carrito.deleteMany({ cliente: data.cliente });

        res.status(200).send({ venta });
    } catch (error) {
        res.status(500).send({ message: 'Error al registrar la compra', data: undefined });
    }
};

// ──────────────────────────────────────────────────────
// ENVÍO DE CORREO DE CONFIRMACIÓN
// ──────────────────────────────────────────────────────

const enviar_correo_compra_cliente = async function (req, res) {
    try {
        const id      = req.params.id;
        const venta   = await Venta.findById(id).populate('cliente');
        const detalles = await Dventa.find({ venta: id }).populate('producto');

        const transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            host   : 'smtp.gmail.com',
            auth   : {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        }));

        const html_raw = await leerHTML(path.join(process.cwd(), 'mail.html'));

        const rest_html = ejs.render(html_raw, {
            data        : detalles,
            cliente     : `${venta.cliente.nombres} ${venta.cliente.apellidos}`,
            _id         : venta._id,
            fecha       : new Date(venta.createdAt),
            subtotal    : venta.subtotal,
            precio_envio: venta.envio_precio,
        });

        const htmlToSend = handlebars.compile(rest_html)({ op: true });

        const mailOptions = {
            from   : process.env.MAIL_USER,
            to     : venta.cliente.email,
            subject: "Gracias por tu compra — MONTERO'S",
            html   : htmlToSend,
        };

        // Responder inmediatamente; el envío es asíncrono
        res.status(200).send({ data: true });

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) console.error('Error al enviar correo:', error);
            else       console.log('Correo enviado:', info.response);
        });
    } catch (error) {
        res.status(500).send({ message: 'Error al enviar el correo', data: undefined });
    }
};

// ──────────────────────────────────────────────────────
// CAMBIO DE ESTADO DEL ENVÍO
// ──────────────────────────────────────────────────────

const MENSAJES_ESTADO = {
    'Enviado'        : (venta) => `Tu producto llegará de acuerdo al plan seleccionado (${venta.envio_titulo}).`,
    'Cancelado'      : ()      => 'Su producto fue cancelado. Su dinero será reembolsado en un plazo de 7 días hábiles.',
    'Finalizado'     : ()      => 'Su producto fue entregado exitosamente.',
    'Procesando'     : ()      => 'Su producto se está preparando para su envío.',
    'Recibido'       : ()      => 'Gracias por la confirmación.',
    'Pendiente Cobro': ()      => 'Recuerda que el delivery debe cobrar el total del envío más el producto.',
};

const cambiar_estado_envio = async function (req, res) {
    try {
        const ventaId    = req.params.id;
        const nuevoEstado = req.body.estado;

        const generarMensaje = MENSAJES_ESTADO[nuevoEstado];
        if (!generarMensaje) {
            return res.status(400).json({ message: 'Estado de envío no válido' });
        }

        const venta = await Venta.findByIdAndUpdate(ventaId, { estado: nuevoEstado });
        const mensaje = generarMensaje(venta);

        res.status(200).json({ message: mensaje });
    } catch (error) {
        res.status(500).json({ message: 'Error al cambiar el estado del envío', error: error.message });
    }
};

// ──────────────────────────────────────────────────────

module.exports = {
    registro_compra_cliente,
    enviar_correo_compra_cliente,
    cambiar_estado_envio,
};
