const express = require('express');
const validateStay= require('../middlewares/validateStay');

const BookingControllers = require('../controllers/BookingControllers');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const authorizedRoles = require('../middlewares/authorizedRoles');


router.use(authMiddleware);
router.get('/mybookings', BookingControllers.myBookings);
router.get('/', authorizedRoles('admin'), BookingControllers.index);
router.get('/show/:id', authorizedRoles('admin'), BookingControllers.show);
router.post('/create', validateStay, BookingControllers.create);
router.put('/edit/:id', BookingControllers.edit);
router.delete('/delete/:id', BookingControllers.destroy);

module.exports=router;