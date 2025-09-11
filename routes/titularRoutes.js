const express = require('express');

const TitularControllers = require('../controllers/TitularControllers')
const router = express.Router();

router.get('/index',TitularControllers.index);
router.get('/show/:id', TitularControllers.show);
router.post('/create', TitularControllers.create);
router.put('/edit/:id', TitularControllers.edit);
router.delete('/delete/:id', TitularControllers.destroy);

module.exports=router;