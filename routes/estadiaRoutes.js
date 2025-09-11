const express = require('express');
const validarEstadia = require('../middlewares/validarEstadias');

const EstadiaControllers = require('../controllers/EstadiaControllers')
const router = express.Router();

router.get('/index',EstadiaControllers.index);
router.get('/show/:id', EstadiaControllers.show);
router.post('/create', validarEstadia, EstadiaControllers.create);
router.put('/edit/:id', EstadiaControllers.edit);
router.delete('/delete/:id', EstadiaControllers.destroy);

module.exports=router;