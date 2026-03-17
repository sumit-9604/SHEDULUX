const express = require('express');
const router = express.Router();
const { schedule } = require('../controllers/scheduleController');

router.post('/schedule', schedule);

module.exports = router;