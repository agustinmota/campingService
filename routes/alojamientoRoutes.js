const express = require('express');

const AlojamientoControllers = require('../controllers/AlojamientoControllers')
const router = express.Router();


router.post('/edit/:id',AlojamientoControllers.edit);
router.delete('/delete/:id',AlojamientoControllers.destroy);
router.post('/create',AlojamientoControllers.create);
router.get('/index',AlojamientoControllers.index);
router.get('/show/:id', AlojamientoControllers.show);


module.exports=router;