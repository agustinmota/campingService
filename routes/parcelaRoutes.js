const express = require('express');

const ParcelaControllers = require('../controllers/ParcelaControllers');
const router = express.Router();

router.get('/index',ParcelaControllers.index);
router.get('/show/:id', ParcelaControllers.show);
router.post('/create', ParcelaControllers.create);
router.put('/edit/:id', ParcelaControllers.edit);
router.delete('/delete/:id', ParcelaControllers.destroy);

module.exports=router;