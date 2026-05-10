'use strict';

const Admin         = require('../models/admin');
const Venta         = require('../models/venta');
const Dventa        = require('../models/dventa');
const Contacto      = require('../models/contacto');
const bcrypt        = require('bcrypt-nodejs');
const jwt           = require('../helpers/jwt');
const fs            = require('fs');
const path          = require('path');
const nodemailer    = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const UPLOAD_ADMIN = path.join(__dirname, '..', 'uploads', 'admin');

function eliminarFotoAnterior(nombreArchivo) {
    if (!nombreArchivo) return;
    const ruta = path.join(UPLOAD_ADMIN, nombreArchivo);
    fs.stat(ruta, (err) => {
        if (!err) fs.unlink(ruta, () => {});
    });
}

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

const verificar_password_admin = async function (req, res) {
    if (!isAdmin(req, res)) return;
    try {
        const password = req.body.password;
        if (!password) return res.status(400).send({ message: 'Contraseña requerida.' });

        const admins = await Admin.find({ email: req.user.email });
        if (admins.length === 0) return res.status(404).send({ message: 'Administrador no encontrado.' });

        const admin = admins[0];
        bcrypt.compare(password, admin.password, function (err, isMatch) {
            if (err || !isMatch) return res.status(401).send({ message: 'Contraseña incorrecta.' });
            res.status(200).send({ message: 'OK' });
        });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor' });
    }
};

const eliminar_admin = async function (req, res) {
    if (!isAdmin(req, res)) return;
    try {
        await Admin.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: 'Administrador eliminado correctamente.' });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor' });
    }
};

const obtener_admins = async function (req, res) {
    if (!isAdmin(req, res)) return;
    try {
        const admins = await Admin.find().select('-password').sort({ createdAt: -1 });
        res.status(200).send({ data: admins });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor' });
    }
};

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

    try {
        const id   = req.params.id;
        const data = req.body;

        const campos = {};
        if (data.nombres !== undefined)          campos.nombres          = data.nombres;
        if (data.apellidos !== undefined)        campos.apellidos        = data.apellidos;
        if (data.telefono !== undefined)         campos.telefono         = data.telefono;
        if (data.dni !== undefined)              campos.dni              = data.dni;
        if (data.fecha_nacimiento !== undefined) campos.fecha_nacimiento = data.fecha_nacimiento;

        if (req.file) {
            const admin = await Admin.findById(id);
            if (admin && admin.foto) eliminarFotoAnterior(admin.foto);
            campos.foto = req.file.filename;
        }

        if (data.password) {
            bcrypt.hash(data.password, null, null, async function (err, hash) {
                if (err) return res.status(500).send({ message: 'Error al cifrar contraseña' });
                campos.password = hash;
                const reg = await Admin.findByIdAndUpdate(id, { $set: campos }, { new: true });
                res.status(200).send({ data: reg });
            });
        } else {
            const reg = await Admin.findByIdAndUpdate(id, { $set: campos }, { new: true });
            res.status(200).send({ data: reg });
        }
    } catch (error) {
        console.error('[actualizar_perfil_admin] ERROR:', error.message);
        res.status(500).send({ message: 'Error de Servidor', error: error.message });
    }
};

const obtener_foto_admin = function (req, res) {
    const img     = req.params.img;
    const ruta    = path.join(UPLOAD_ADMIN, img);
    const fallback = path.join(__dirname, '..', 'uploads', 'default.jpg');
    fs.stat(ruta, (err) => {
        res.status(200).sendFile(err ? fallback : ruta);
    });
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

const obtener_detalle_mensaje_admin = async function (req, res) {
    if (!isAdmin(req, res)) return;
    try {
        const reg = await Contacto.findById(req.params.id);
        if (!reg) return res.status(404).send({ message: 'Mensaje no encontrado', data: undefined });
        res.status(200).send({ data: reg });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

const responder_mensaje_admin = async function (req, res) {
    if (!isAdmin(req, res)) return;
    try {
        const { respuesta, asunto, correo_admin, nombre_admin } = req.body;

        if (!respuesta || !asunto || !correo_admin) {
            return res.status(400).send({ message: 'Faltan campos requeridos.' });
        }

        const mensaje = await Contacto.findById(req.params.id);
        if (!mensaje) return res.status(404).send({ message: 'Mensaje no encontrado' });

        const anio = new Date().getFullYear();

        const htmlEmail = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f2f1ed;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f2f1ed;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr>
          <td style="background:#2d2d2d;padding:24px 32px;border-radius:8px 8px 0 0;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:22px;letter-spacing:2px;font-weight:700;">MONTERO'S</h1>
            <p style="color:#aaa;margin:4px 0 0;font-size:12px;letter-spacing:1px;">Atención al cliente</p>
          </td>
        </tr>
        <tr>
          <td style="background:#fff;padding:32px;border:1px solid #e8e8e8;border-top:none;">
            <p style="font-size:16px;color:#2d2d2d;margin:0 0 6px 0;">Hola, <strong>${mensaje.cliente}</strong></p>
            <p style="font-size:14px;color:#666;margin:0 0 28px 0;">Gracias por escribirnos. A continuación encontrará nuestra respuesta a su consulta.</p>

            <div style="background:#f8f9fa;border-left:3px solid #c9a84c;padding:14px 18px;border-radius:0 4px 4px 0;margin-bottom:24px;">
              <p style="font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 8px 0;">Su consulta original:</p>
              <p style="font-size:14px;color:#555;font-style:italic;margin:0;line-height:1.6;">${mensaje.mensaje}</p>
            </div>

            <div style="margin-bottom:28px;">
              <p style="font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 10px 0;">Nuestra respuesta:</p>
              <p style="font-size:15px;color:#2d2d2d;line-height:1.7;margin:0;white-space:pre-wrap;">${respuesta}</p>
            </div>

            <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">

            <p style="font-size:13px;color:#888;margin:0;line-height:1.8;">
              Atentamente,<br>
              <strong style="color:#2d2d2d;font-size:14px;">${nombre_admin}</strong><br>
              <a href="mailto:${correo_admin}" style="color:#c9a84c;text-decoration:none;">${correo_admin}</a><br>
              <span style="color:#aaa;font-size:12px;">MONTERO'S — Equipo de atención</span>
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#2d2d2d;padding:14px 32px;border-radius:0 0 8px 8px;text-align:center;">
            <p style="color:#777;font-size:11px;margin:0;">© ${anio} MONTERO'S · Todos los derechos reservados</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

        const transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            host   : 'smtp.gmail.com',
            auth   : {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        }));

        const mailOptions = {
            from   : `MONTERO'S <${process.env.MAIL_USER}>`,
            replyTo: `${nombre_admin} <${correo_admin}>`,
            to     : mensaje.correo,
            subject: asunto,
            html   : htmlEmail,
        };

        res.status(200).send({ data: true });

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) console.error('[responder_mensaje_admin] Error:', error);
            else       console.log('[responder_mensaje_admin] Enviado:', info.response);
        });

    } catch (error) {
        res.status(500).send({ message: 'Error al enviar respuesta', data: undefined });
    }
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
    verificar_password_admin,
    eliminar_admin,
    obtener_admins,
    obtener_admin,
    actualizar_perfil_admin,
    obtener_foto_admin,
    obtener_mensaje_admin,
    cerrar_mensaje_admin,
    obtener_detalle_mensaje_admin,
    responder_mensaje_admin,
    obtener_ventas_admin,
    kpi_ganancias_mensuales_admin,
    kpi_ganancias_diaria_admin,
    kpi_mejores_cliente,
    kpi_mejores_items,
};
