const express = require('express');

const GuestControllers = require('../controllers/GuestControllers')
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const authorizedRoles = require('../middlewares/authorizedRoles');


router.use(authMiddleware);
router.get('/', authorizedRoles('admin'), GuestControllers.index);
router.get('/show/:id', authorizedRoles('admin'), GuestControllers.show);
router.post('/create', GuestControllers.create);
router.put('/edit/:id', GuestControllers.edit);
router.delete('/delete/:id', GuestControllers.destroy);

module.exports=router;