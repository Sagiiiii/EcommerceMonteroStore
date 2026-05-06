'use strict';

const express         = require('express');
const router          = express.Router();
const adminController = require('../controllers/AdminController');
const auth            = require('../middlewares/authenticate');

// ── Auth ───────────────────────────────────────────────
router.post('/registro_admin',  adminController.registro_admin);
router.post('/login_admin',     adminController.login_admin);

// ── Perfil ─────────────────────────────────────────────
router.get ('/obtener_admin/:id',             auth.auth, adminController.obtener_admin);
router.put ('/actualizar_perfil_admin/:id',   auth.auth, adminController.actualizar_perfil_admin);

// ── Mensajes ───────────────────────────────────────────
router.get ('/obtener_mensaje_admin',         auth.auth, adminController.obtener_mensaje_admin);
router.put ('/cerrar_mensaje_admin/:id',      auth.auth, adminController.cerrar_mensaje_admin);

// ── Ventas ─────────────────────────────────────────────
router.get ('/obtener_ventas_admin/:desde?/:hasta?', auth.auth, adminController.obtener_ventas_admin);

// ── KPI ────────────────────────────────────────────────
router.get ('/kpi_ganancias_mensuales_admin', auth.auth, adminController.kpi_ganancias_mensuales_admin);
router.get ('/kpi_ganancias_diaria_admin',    auth.auth, adminController.kpi_ganancias_diaria_admin);
router.get ('/kpi_mejores_cliente',           auth.auth, adminController.kpi_mejores_cliente);
router.get ('/kpi_mejores_items',             auth.auth, adminController.kpi_mejores_items);

module.exports = router;
