const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {createSemester, renderCreateSemester} = require('../controllers/semestre');

//TODO: Add isLoggedIn, isAdmin middleware
router.route('/create')
    .get(renderCreateSemester)
    .post(catchAsync(createSemester));

module.exports = router;
// const { isLoggedIn, isAdmin } = require('../middleware');
