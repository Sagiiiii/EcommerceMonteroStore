'use strict';

const Config = require('../models/config');
const fs     = require('fs');
const path   = require('path');

function isAdmin(req, res) {
    if (!req.user) {
        res.status(403).send({ message: 'NoAccess' });
        return false;
    }
    if (req.user.role !== 'admin') {
        res.status(403).send({ message: 'NoAccess' });
        return false;
    }
    return true;
}

// eliminar logo anterior
function eliminarArchivoAnterior(nombreArchivo) {
    if (!nombreArchivo) return;

    const ruta = `./uploads/configuraciones/${nombreArchivo}`;
    fs.stat(ruta, function (err) {
        if (!err) {
            fs.unlink(ruta, (e) => {
                if (e) console.error('Error eliminando logo:', e);
            });
        }
    });
}

// 🔥 OBTENER CONFIG (SI NO EXISTE → CREA)
const obtener_config_admin = async function (req, res) {
    if (!isAdmin(req, res)) return;

    try {
        let config = await Config.findOne();

        if (!config) {
            config = await Config.create({
                titulo: "MONTERO'S",
                logo: "default.jpg",
                serie: "001",
                correlativo: "0001",
                categorias: []
            });
        }

        res.status(200).send({ data: config });

    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', error });
    }
};

// 🔥 ACTUALIZAR CONFIG
const actualiza_config_admin = async function (req, res) {
    if (!isAdmin(req, res)) return;

    try {
        const data = req.body;

        let config = await Config.findOne();

        if (!config) {
            return res.status(404).send({ message: 'Config no encontrada' });
        }

        let updateData = {
            titulo: data.titulo,
            serie: data.serie,
            correlativo: data.correlativo,
            categorias: typeof data.categorias === 'string'
                ? JSON.parse(data.categorias)
                : data.categorias
        };

        // 📸 si viene imagen
        if (req.files && req.files.logo) {
            const img_path  = req.files.logo.path;
            const logo_name = img_path.split(/[/\\]/).pop();

            eliminarArchivoAnterior(config.logo);
            updateData.logo = logo_name;
        }

        const reg = await Config.findByIdAndUpdate(config._id, updateData, { new: true });

        res.status(200).send({ data: reg });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error de Servidor', error });
    }
};

const obtener_logo = function (req, res) {
    const img = req.params.img;
    const ruta = `./uploads/configuraciones/${img}`;
    const fallback = './uploads/default.jpg';

    fs.stat(ruta, function (err) {
        const archivo = err ? fallback : ruta;
        res.status(200).sendFile(path.resolve(archivo));
    });
};

const obtener_config_publico = async function (req, res) {
    try {
        const config = await Config.findOne();
        res.status(200).send({ data: config });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor' });
    }
};

const subir_icono_categoria = function (req, res) {
    if (!isAdmin(req, res)) return;
    try {
        if (!req.files || !req.files.icono) {
            return res.status(400).send({ message: 'No se recibió imagen' });
        }
        const img_name = req.files.icono.path.split(/[/\\]/).pop();
        res.status(200).send({ data: img_name });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor' });
    }
};

const obtener_icono_categoria = function (req, res) {
    const img  = req.params.img;
    const ruta = `./uploads/configuraciones/${img}`;
    fs.stat(ruta, function (err) {
        const archivo = err ? './uploads/default.jpg' : ruta;
        res.status(200).sendFile(path.resolve(archivo));
    });
};

module.exports = {
    obtener_config_admin,
    actualiza_config_admin,
    obtener_logo,
    obtener_config_publico,
    subir_icono_categoria,
    obtener_icono_categoria,
};