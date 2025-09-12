const express = require('express');
const validateStay= require('../middlewares/validateStay');

const BookingControllers = require('../controllers/BookingControllers');
const router = express.Router();

router.get('/index', BookingControllers.index);
router.get('/show/:id', BookingControllers.show);
router.post('/create', validateStay, BookingControllers.create);
router.put('/edit/:id', BookingControllers.edit);
router.delete('/delete/:id', BookingControllers.destroy);

module.exports=router;