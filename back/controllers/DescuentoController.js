'use strict';

const Descuento = require('../models/descuento');
const fs        = require('fs');
const path      = require('path');

function isAdmin(req, res) {
    if (!req.user)                 { res.status(403).send({ message: 'NoAccess' }); return false; }
    if (req.user.role !== 'admin') { res.status(403).send({ message: 'NoAccess' }); return false; }
    return true;
}

function eliminarBannerAnterior(nombreArchivo) {
    const ruta = `./uploads/promociones/${nombreArchivo}`;
    fs.stat(ruta, function (err) {
        if (!err) {
            fs.unlink(ruta, (unlinkErr) => {
                if (unlinkErr) console.error('Error al eliminar banner:', unlinkErr);
            });
        }
    });
}

function extraerNombreImagen(filePath) {
    // Soporta tanto separador Windows (\) como Unix (/)
    return filePath.split(/[/\\]/).pop();
}

const registro_descuento_admin = async function (req, res) {
    if (!isAdmin(req, res)) return;
    try {
        const data        = req.body;
        data.banner       = extraerNombreImagen(req.files.banner.path);
        const reg         = await Descuento.create(data);
        res.status(200).send({ data: reg });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

const listar_descuento_admin = async function (req, res) {
    if (!isAdmin(req, res)) return;
    try {
        const reg = await Descuento.find({ titulo: new RegExp(req.params.filtro, 'i') })
            .sort({ createdAt: -1 });
        res.status(200).send({ data: reg });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

const obtener_banner_descuento = function (req, res) {
    const img  = req.params.img;
    const ruta = `./uploads/promociones/${img}`;

    fs.stat(ruta, function (err) {
        const archivo = err ? './uploads/default.jpg' : ruta;
        res.status(200).sendFile(path.resolve(archivo));
    });
};

const obtener_descuento_admin = async function (req, res) {
    if (!isAdmin(req, res)) return;
    try {
        const reg = await Descuento.findById(req.params.id);
        res.status(200).send({ data: reg });
    } catch (error) {
        res.status(200).send({ data: undefined });
    }
};

const actualizar_descuento_admin = async function (req, res) {
    if (!isAdmin(req, res)) return;
    try {
        const id   = req.params.id;
        const data = req.body;

        const camposBase = {
            titulo      : data.titulo,
            descuento   : data.descuento,
            fecha_inicio: data.fecha_inicio,
            fecha_fin   : data.fecha_fin,
        };

        if (req.files && req.files.banner) {
            const banner_name = extraerNombreImagen(req.files.banner.path);
            const reg = await Descuento.findByIdAndUpdate(id, { ...camposBase, banner: banner_name });
            eliminarBannerAnterior(reg.banner);
            res.status(200).send({ data: reg });
        } else {
            const reg = await Descuento.findByIdAndUpdate(id, camposBase);
            res.status(200).send({ data: reg });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

const eliminar_descuento_admin = async function (req, res) {
    if (!isAdmin(req, res)) return;
    try {
        const reg = await Descuento.findByIdAndRemove(req.params.id);
        res.status(200).send({ data: reg });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

const obtener_descuento_activo = async function (req, res) {
    try {
        const descuentos = await Descuento.find().sort({ createdAt: -1 });
        const today      = Date.now() / 1000;

        const activos = descuentos.filter(item => {
            const inicio = Date.parse(`${item.fecha_inicio}T00:00:00`) / 1000;
            const fin    = Date.parse(`${item.fecha_fin}T23:59:59`)    / 1000;
            return today >= inicio && today <= fin;
        });

        res.status(200).send({ data: activos.length > 0 ? activos : undefined });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

module.exports = {
    registro_descuento_admin,
    listar_descuento_admin,
    obtener_banner_descuento,
    obtener_descuento_admin,
    actualizar_descuento_admin,
    eliminar_descuento_admin,
    obtener_descuento_activo,
};
