const express = require('express');

const AccommodationControllers = require('../controllers/AccommodationControllers');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');


router.get('/index',AccommodationControllers.index);
router.get('/show/:id', AccommodationControllers.show);
router.use(authMiddleware);
router.post('/create',AccommodationControllers.create);
router.post('/edit/:id',AccommodationControllers.edit);
router.delete('/delete/:id',AccommodationControllers.destroy);


module.exports=router;