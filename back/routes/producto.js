'use strict';

const express              = require('express');
const router               = express.Router();
const productoController   = require('../controllers/ProductoController');
const auth                 = require('../middlewares/authenticate');
const multipartyMiddleware = require('connect-multiparty');
const multiparty           = multipartyMiddleware({ uploadDir: './uploads/productos' });

// ── Producto (admin) ───────────────────────────────────
router.post  ('/registro_producto_admin',                [auth.auth, multiparty], productoController.registro_producto_admin);
router.get   ('/listar_productos_admin/:filtro?',         auth.auth,              productoController.listar_productos_filtro_admin);
router.get   ('/obtener_portada/:img',                                            productoController.obtener_portada);
router.get   ('/obtener_producto_admin/:id',              auth.auth,              productoController.obtener_producto_admin);
router.put   ('/actualizar_producto_admin/:id',          [auth.auth, multiparty], productoController.actualizar_producto_admin);
router.delete('/eliminar_producto_admin/:id',             auth.auth,              productoController.eliminar_producto_admin);
router.put   ('/actualizar_producto_variedades_admin/:id',auth.auth,              productoController.actualizar_producto_variedades_admin);
router.put   ('/agregar_imagen_galeria_admin/:id',       [auth.auth, multiparty], productoController.agregar_imagen_galeria_admin);
router.put   ('/eliminar_imagen_galeria_admin/:id',       auth.auth,              productoController.eliminar_imagen_galeria_admin);

// ── Inventario (admin) ─────────────────────────────────
router.get   ('/listar_inventario_producto_admin/:id',    auth.auth, productoController.listar_inventario_producto_admin);
router.post  ('/registro_inventario_producto_admin',      auth.auth, productoController.registro_inventario_producto_admin);
router.delete('/eliminar_inventario_producto_admin/:id',  auth.auth, productoController.eliminar_inventario_producto_admin);

// ── Público ────────────────────────────────────────────
router.get('/listar_productos_publico/:filtro?',            productoController.listar_productos_publico);
router.get('/listar_productos_nuevos_publico',              productoController.listar_productos_nuevos_publico);
router.get('/listar_productos_mas_vendidos_publico',        productoController.listar_productos_mas_vendidos_publico);
router.get('/listar_productos_recomendados_publico/:categoria', productoController.listar_productos_recomendados_publico);
router.get('/obtener_productos_slug_publico/:slug',         productoController.obtener_productos_slug_publico);
router.get('/obtener_reviews_producto_publico/:id',         productoController.obtener_reviews_producto_publico);

module.exports = router;
