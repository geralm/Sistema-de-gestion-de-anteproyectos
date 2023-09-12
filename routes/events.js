const express = require('express');
const router = express.Router();
const events = require('../controllers/events');

router.route('/')
    .get(events.renderIndex) //We need to add middleware here
    .post(events.createEvent);
router.get('/new',events.renderNewEvent);
module.exports = router;