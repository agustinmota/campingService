const express = require('express');

const GuestControllers = require('../controllers/GuestControllers')
const router = express.Router();

router.get('/index',GuestControllers.index);
router.get('/show/:id', GuestControllers.show);
router.post('/create', GuestControllers.create);
router.put('/edit/:id', GuestControllers.edit);
router.delete('/delete/:id', GuestControllers.destroy);

module.exports=router;