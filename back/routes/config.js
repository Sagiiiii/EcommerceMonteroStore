'use strict';

const express           = require('express');
const router            = express.Router();
const configController  = require('../controllers/ConfigController');
const auth              = require('../middlewares/authenticate');
const multipartyMiddleware = require('connect-multiparty');
const multiparty        = multipartyMiddleware({ uploadDir: './uploads/configuraciones' });

router.put ('/actualiza_config_admin/:id',   [auth.auth, multiparty], configController.actualiza_config_admin);
router.get ('/obtener_config_admin',          auth.auth,              configController.obtener_config_admin);
router.get ('/obtener_logo/:img',                                     configController.obtener_logo);
router.get ('/obtener_config_publico',                                configController.obtener_config_publico);
router.post('/subir_icono_categoria',        [auth.auth, multiparty], configController.subir_icono_categoria);
router.get ('/obtener_icono_categoria/:img',                          configController.obtener_icono_categoria);

module.exports = router;
