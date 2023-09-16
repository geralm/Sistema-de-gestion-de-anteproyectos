const express = require('express');
const router = express.Router();
const events = require('../controllers/landing');

router.route('/').get(events.renderLanding)



module.exports = router;