const express = require('express');
const router = express.Router()
const loginController = require('../controller/signup')
router.post('/', loginController.login)

module.exports = router;