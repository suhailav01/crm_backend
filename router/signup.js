const express = require('express')
const router = express.Router()
const signupController = require('../controller/signup')
router.post('/',signupController.signup)
router.get('/users',signupController.getAllUsersController)
module.exports = router