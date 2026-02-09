const express = require('express')
const router = new express.Router()
const utilities = require("../utilities/")
const accController = require("../controllers/accController")
const regValidate = require('../utilities/account-validation')


// Login view
router.get("/login", accController.buildLogin)

router.get("/register", accController.buildRegister)

router.get("/", utilities.checkLogin, accController.buildManagement)

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
  utilities.handleErrors(accController.accountLogin)
)

// Deliver update account view
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accController.buildUpdateAccount)
)

// Process account update
router.post(
  "/update",
  utilities.checkLogin,
  regValidate.updateAccountRules(),
  regValidate.checkUpdateAccountData,
  utilities.handleErrors(accController.updateAccount)
)

// Process password change
router.post(
  "/update-password",
  utilities.checkLogin,
  regValidate.passwordRules(),
  regValidate.checkPassword,
  utilities.handleErrors(accController.updatePassword)
)


router.get("/logout", accController.accountLogout)


module.exports = router