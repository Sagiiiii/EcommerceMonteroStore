'use strict';

const express               = require('express');
const router                = express.Router();
const descuentoController   = require('../controllers/DescuentoController');
const auth                  = require('../middlewares/authenticate');
const multipartyMiddleware  = require('connect-multiparty');
const multiparty            = multipartyMiddleware({ uploadDir: './uploads/promociones' });

router.post  ('/registro_descuento_admin',         [auth.auth, multiparty], descuentoController.registro_descuento_admin);
router.get   ('/listar_descuento_admin/:filtro?',   auth.auth,              descuentoController.listar_descuento_admin);
router.get   ('/obtener_banner_descuento/:img',                             descuentoController.obtener_banner_descuento);
router.get   ('/obtener_descuento_admin/:id',       auth.auth,              descuentoController.obtener_descuento_admin);
router.put   ('/actualizar_descuento_admin/:id',   [auth.auth, multiparty], descuentoController.actualizar_descuento_admin);
router.delete('/eliminar_descuento_admin/:id',      auth.auth,              descuentoController.eliminar_descuento_admin);
router.get   ('/obtener_descuento_activo',                                  descuentoController.obtener_descuento_activo);

module.exports = router;
