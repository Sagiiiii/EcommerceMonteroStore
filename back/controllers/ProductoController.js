'use strict';

const Producto   = require('../models/producto');
const Inventario = require('../models/inventario');
const Review     = require('../models/review');
const fs         = require('fs');
const path       = require('path');

function isAdmin(req, res) {
    if (!req.user)                 { res.status(403).send({ message: 'NoAccess' }); return false; }
    if (req.user.role !== 'admin') { res.status(403).send({ message: 'NoAccess' }); return false; }
    return true;
}

function extraerNombreImagen(filePath) {
    return filePath.split(/[/\\]/).pop();
}

function eliminarImagenAnterior(carpeta, nombreArchivo) {
    const ruta = `./uploads/${carpeta}/${nombreArchivo}`;
    fs.stat(ruta, function (err) {
        if (!err) {
            fs.unlink(ruta, (unlinkErr) => {
                if (unlinkErr) console.error('Error al eliminar imagen:', unlinkErr);
            });
        }
    });
}

// ──────────────────────────────────────────────────────
// PRODUCTO (ADMIN)
// ──────────────────────────────────────────────────────

const registro_producto_admin = async function (req, res) {
    if (!isAdmin(req, res)) return;
    try {
        const data     = req.body;
        data.slug      = data.titulo.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        data.portada   = extraerNombreImagen(req.files.portada.path);

        const reg        = await Producto.create(data);
        const inventario = await Inventario.create({
            admin    : req.user.sub,
            cantidad : data.stock,
            proveedor: 'Primer Registro',
            producto : reg._id,
        });

        res.status(200).send({ data: reg, inventario });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

const listar_productos_filtro_admin = async function (req, res) {
    if (!isAdmin(req, res)) return;
    try {
        const reg = await Producto.find({ titulo: new RegExp(req.params.filtro, 'i') });
        res.status(200).send({ data: reg });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

const obtener_portada = function (req, res) {
    const img  = req.params.img;
    const ruta = `./uploads/productos/${img}`;
    fs.stat(ruta, function (err) {
        const archivo = err ? './uploads/default.jpg' : ruta;
        res.status(200).sendFile(path.resolve(archivo));
    });
};

const obtener_producto_admin = async function (req, res) {
    if (!isAdmin(req, res)) return;
    try {
        const reg = await Producto.findById(req.params.id);
        res.status(200).send({ data: reg });
    } catch (error) {
        res.status(200).send({ data: undefined });
    }
};

const actualizar_producto_admin = async function (req, res) {
    if (!isAdmin(req, res)) return;
    try {
        const id   = req.params.id;
        const data = req.body;

        const camposBase = {
            titulo     : data.titulo,
            stock      : data.stock,
            precio     : data.precio,
            categoria  : data.categoria,
            descripcion: data.descripcion,
            contenido  : data.contenido,
        };

        if (req.files && req.files.portada) {
            const portada_name = extraerNombreImagen(req.files.portada.path);
            const reg = await Producto.findByIdAndUpdate(id, { ...camposBase, portada: portada_name });
            eliminarImagenAnterior('productos', reg.portada);
            res.status(200).send({ data: reg });
        } else {
            const reg = await Producto.findByIdAndUpdate(id, camposBase);
            res.status(200).send({ data: reg });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

const eliminar_producto_admin = async function (req, res) {
    if (!isAdmin(req, res)) return;
    try {
        const reg = await Producto.findByIdAndRemove(req.params.id);
        res.status(200).send({ data: reg });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

const actualizar_producto_variedades_admin = async function (req, res) {
    if (!isAdmin(req, res)) return;
    try {
        const data = req.body;
        const reg  = await Producto.findByIdAndUpdate(req.params.id, {
            titulo_variedad: data.titulo_variedad,
            variedades     : data.variedades,
        });
        res.status(200).send({ data: reg });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

const agregar_imagen_galeria_admin = async function (req, res) {
    if (!isAdmin(req, res)) return;
    try {
        const id         = req.params.id;
        const data       = req.body;
        const imagen_name = extraerNombreImagen(req.files.imagen.path);

        const reg = await Producto.findByIdAndUpdate(id, {
            $push: { galeria: { imagen: imagen_name, _id: data._id } },
        });
        res.status(200).send({ data: reg });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

const eliminar_imagen_galeria_admin = async function (req, res) {
    if (!isAdmin(req, res)) return;
    try {
        const reg = await Producto.findByIdAndUpdate(req.params.id, {
            $pull: { galeria: { _id: req.body._id } },
        });
        res.status(200).send({ data: reg });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

// ──────────────────────────────────────────────────────
// INVENTARIO (ADMIN)
// ──────────────────────────────────────────────────────

const listar_inventario_producto_admin = async function (req, res) {
    if (!isAdmin(req, res)) return;
    try {
        const reg = await Inventario.find({ producto: req.params.id })
            .populate('admin')
            .sort({ createdAt: -1 });
        res.status(200).send({ data: reg });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

const registro_inventario_producto_admin = async function (req, res) {
    if (!isAdmin(req, res)) return;
    try {
        const reg        = await Inventario.create(req.body);
        const prod       = await Producto.findById(reg.producto);
        const nuevo_stock = parseInt(prod.stock) + parseInt(reg.cantidad);
        await Producto.findByIdAndUpdate(reg.producto, { stock: nuevo_stock });
        res.status(200).send({ data: reg });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

const eliminar_inventario_producto_admin = async function (req, res) {
    if (!isAdmin(req, res)) return;
    try {
        const reg        = await Inventario.findByIdAndRemove(req.params.id);
        const prod       = await Producto.findById(reg.producto);
        const nuevo_stock = parseInt(prod.stock) - parseInt(reg.cantidad);
        const producto   = await Producto.findByIdAndUpdate(reg.producto, { stock: nuevo_stock });
        res.status(200).send({ data: producto });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

// ──────────────────────────────────────────────────────
// PÚBLICO
// ──────────────────────────────────────────────────────

const listar_productos_publico = async function (req, res) {
    try {
        const reg = await Producto.find({ titulo: new RegExp(req.params.filtro, 'i') })
            .sort({ createdAt: -1 });
        res.status(200).send({ data: reg });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

const obtener_productos_slug_publico = async function (req, res) {
    try {
        const reg = await Producto.findOne({ slug: req.params.slug });
        res.status(200).send({ data: reg });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

const listar_productos_recomendados_publico = async function (req, res) {
    try {
        const reg = await Producto.find({ categoria: req.params.categoria })
            .sort({ createdAt: -1 })
            .limit(8);
        res.status(200).send({ data: reg });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

const listar_productos_nuevos_publico = async function (req, res) {
    try {
        const reg = await Producto.find().sort({ createdAt: -1 }).limit(8);
        res.status(200).send({ data: reg });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

const listar_productos_mas_vendidos_publico = async function (req, res) {
    try {
        const reg = await Producto.find().sort({ nventas: -1 }).limit(8);
        res.status(200).send({ data: reg });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

const obtener_reviews_producto_publico = async function (req, res) {
    try {
        const reviews = await Review.find({ producto: req.params.id })
            .populate('cliente')
            .sort({ createdAt: -1 });
        res.status(200).send({ data: reviews });
    } catch (error) {
        res.status(500).send({ message: 'Error de Servidor', data: undefined });
    }
};

// ──────────────────────────────────────────────────────

module.exports = {
    // Producto admin
    registro_producto_admin,
    listar_productos_filtro_admin,
    obtener_portada,
    obtener_producto_admin,
    actualizar_producto_admin,
    eliminar_producto_admin,
    actualizar_producto_variedades_admin,
    agregar_imagen_galeria_admin,
    eliminar_imagen_galeria_admin,
    // Inventario admin
    listar_inventario_producto_admin,
    registro_inventario_producto_admin,
    eliminar_inventario_producto_admin,
    // Público
    listar_productos_publico,
    obtener_productos_slug_publico,
    listar_productos_recomendados_publico,
    listar_productos_nuevos_publico,
    listar_productos_mas_vendidos_publico,
    obtener_reviews_producto_publico,
};
