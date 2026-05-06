'use strict';

const express          = require('express');
const router           = express.Router();
const ventaController  = require('../controllers/VentaController');
const auth             = require('../middlewares/authenticate');

router.post('/registro_compra_cliente',          auth.auth, ventaController.registro_compra_cliente);
router.get ('/enviar_correo_compra_cliente/:id', auth.auth, ventaController.enviar_correo_compra_cliente);
router.put ('/cambiar_estado_envio/:id',         auth.auth, ventaController.cambiar_estado_envio);

module.exports = router;
