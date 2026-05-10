'use strict';

const path            = require('path');
const express         = require('express');
const router          = express.Router();
const multer          = require('multer');
const adminController = require('../controllers/AdminController');
const auth            = require('../middlewares/authenticate');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'admin');

const storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, UPLOAD_DIR); },
    filename:    function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + '-admin' + ext);
    }
});

const upload = multer({ storage: storage, limits: { fileSize: 4 * 1024 * 1024 } });

// ── Auth ───────────────────────────────────────────────
router.post('/registro_admin', adminController.registro_admin);
router.post('/login_admin',    adminController.login_admin);

// ── Administradores ────────────────────────────────────
router.get   ('/obtener_admins',              auth.auth, adminController.obtener_admins);
router.post  ('/verificar_password_admin',    auth.auth, adminController.verificar_password_admin);
router.delete('/eliminar_admin/:id',          auth.auth, adminController.eliminar_admin);

// ── Perfil ─────────────────────────────────────────────
router.get ('/obtener_admin/:id',           auth.auth,                          adminController.obtener_admin);
router.put ('/actualizar_perfil_admin/:id', [auth.auth, upload.single('foto')], adminController.actualizar_perfil_admin);
router.get ('/obtener_foto_admin/:img',                                         adminController.obtener_foto_admin);

// ── Mensajes ───────────────────────────────────────────
router.get  ('/obtener_mensaje_admin',              auth.auth, adminController.obtener_mensaje_admin);
router.get  ('/obtener_detalle_mensaje_admin/:id',  auth.auth, adminController.obtener_detalle_mensaje_admin);
router.put  ('/cerrar_mensaje_admin/:id',           auth.auth, adminController.cerrar_mensaje_admin);
router.post ('/responder_mensaje_admin/:id',        auth.auth, adminController.responder_mensaje_admin);

// ── Ventas ─────────────────────────────────────────────
router.get ('/obtener_ventas_admin/:desde?/:hasta?', auth.auth, adminController.obtener_ventas_admin);

// ── KPI ────────────────────────────────────────────────
router.get ('/kpi_ganancias_mensuales_admin', auth.auth, adminController.kpi_ganancias_mensuales_admin);
router.get ('/kpi_ganancias_diaria_admin',    auth.auth, adminController.kpi_ganancias_diaria_admin);
router.get ('/kpi_mejores_cliente',           auth.auth, adminController.kpi_mejores_cliente);
router.get ('/kpi_mejores_items',             auth.auth, adminController.kpi_mejores_items);

module.exports = router;
