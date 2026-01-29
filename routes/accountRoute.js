const express = require('express')
const router = new express.Router()
const utilities = require("../utilities/")
const accController = require("../controllers/accController")
const regValidate = require('../utilities/account-validation')

// Login view
router.get("/login", accController.buildLogin)

router.get("/register", accController.buildRegister)

// Error trigger
// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accController.registerAccount)
)

// Process the login attempt
 router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accController.loginAccount)
)

module.exports = router