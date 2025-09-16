const express = require('express');

const AccommodationControllers = require('../controllers/AccommodationControllers');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const authorizedRoles = require('../middlewares/authorizedRoles');

router.get('/',AccommodationControllers.index);
router.get('/show/:id', AccommodationControllers.show);
router.use(authMiddleware);
router.post('/create', authorizedRoles('admin'), AccommodationControllers.create);
router.post('/edit/:id', authorizedRoles('admin'), AccommodationControllers.edit);
router.delete('/delete/:id', authorizedRoles('admin'), AccommodationControllers.destroy);


module.exports = router;