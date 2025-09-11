const express = require('express');

const CabanaControllers = require('../controllers/CabanaControllers')
const router = express.Router();

router.get('/index',CabanaControllers.index);
router.get('/show/:id', CabanaControllers.show);
router.post('/edit/:id',CabanaControllers.edit);
router.delete('/delete/:id',CabanaControllers.destroy);
router.post('/create',CabanaControllers.create);

module.exports=router;