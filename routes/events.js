const express = require('express');
const router = express.Router();
const events = require('../controllers/events');
const {validateEvent, isLoggedIn, isAdmin} = require('../middleware/middlewares');
const catchAsync = require('../utils/catchAsync');

router.route('/')
    .get(catchAsync(events.renderIndex)) 
    .post(isLoggedIn,isAdmin,validateEvent ,catchAsync(events.createEvent));
    
router.get('/new',isLoggedIn,isAdmin,events.renderNewEvent);
router.route('/:id')
    .get(catchAsync(events.showEvent))
    .put(isLoggedIn,isAdmin,validateEvent, catchAsync(events.updateEvent))
    .delete(isLoggedIn,isAdmin,catchAsync(events.deleteEvent));

router.get('/:id/edit',isLoggedIn,isAdmin, catchAsync(events.renderEditForm)); //VALIDATE IF IS ADMIN
module.exports = router;