const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {createSemester, renderAdminSemester,deleteSemester} = require('../controllers/semestre');

//TODO: Add isLoggedIn, isAdmin middleware
router.route('/')
    .get(renderAdminSemester)
    .post(catchAsync(createSemester));
router.route('/:id')
    .delete(catchAsync(deleteSemester));

module.exports = router;
// const { isLoggedIn, isAdmin } = require('../middleware');
