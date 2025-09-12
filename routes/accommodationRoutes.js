const express = require('express');

const AccommodationControllers = require('../controllers/AccommodationControllers');
const router = express.Router();


router.post('/edit/:id',AccommodationControllers.edit);
router.delete('/delete/:id',AccommodationControllers.destroy);
router.post('/create',AccommodationControllers.create);
router.get('/index',AccommodationControllers.index);
router.get('/show/:id', AccommodationControllers.show);


module.exports=router;