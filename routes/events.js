const express = require('express');
const router = express.Router();
const events = require('../controllers/events');
const {validateEvent} = require('../middleware/middlewares');
const catchAsync = require('../utils/catchAsync');

router.route('/')
    .get(catchAsync(events.renderIndex)) 
    .post(validateEvent ,catchAsync(events.createEvent));
router.get('/new',events.renderNewEvent);
router.route('/:id')
    .get(catchAsync(events.showEvent))
    .put(validateEvent, catchAsync(events.updateEvent))
    .delete(catchAsync(events.deleteEvent));

router.get('/:id/edit', catchAsync(events.renderEditForm)); //VALIDATE IF IS ADMIN
module.exports = router;