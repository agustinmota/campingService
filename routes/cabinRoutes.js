const express = require('express');

const CabinControllers = require('../controllers/CabinControllers');
const router = express.Router();

router.get('/index', CabinControllers.index);
router.get('/show/:id', CabinControllers.show);
router.post('/edit/:id', CabinControllers.edit);
router.delete('/delete/:id', CabinControllers.destroy);
router.post('/create', CabinControllers.create);

module.exports=router;