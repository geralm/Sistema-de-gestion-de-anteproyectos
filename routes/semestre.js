const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {createSemester, renderAdminSemester,deleteSemester} = require('../controllers/semestre');
const { isLoggedIn, isAdmin, validateSemester } = require('../middleware/middlewares');

router.route('/')
    .get(isLoggedIn, isAdmin,renderAdminSemester)
    .post(isLoggedIn, isAdmin,validateSemester, catchAsync(createSemester));
router.route('/:id')
    .delete(catchAsync(deleteSemester));

module.exports = router;
// const { isLoggedIn, isAdmin } = require('../middleware');
