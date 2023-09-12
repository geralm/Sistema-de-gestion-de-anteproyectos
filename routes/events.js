const express = require('express');
const router = express.Router();
const events = require('../controllers/events');
const {validateEvent} = require('../middleware/middlewares');
const catchAsync = require('../utils/catchAsync');

router.route('/')
    .get(events.renderIndex) //We need to add middleware here
    .post(validateEvent ,catchAsync(events.createEvent));
router.get('/new',events.renderNewEvent);
module.exports = router;