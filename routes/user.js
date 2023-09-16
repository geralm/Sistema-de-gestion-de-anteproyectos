const express = require('express');
const router = express.Router();
const user = require('../controllers/user');
const {validateUser} = require('../middleware/middlewares');
const catchAsync = require('../utils/catchAsync');

router.route('/new').post(validateUser ,catchAsync(user.createUsuario));

module.exports = router