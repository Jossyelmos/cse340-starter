const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null
  })
}


/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

async function buildManagement(req, res, next) {
  let nav = await utilities.getNav()
  req.flash("notice", "You're logged in")
  res.render("account/index", {
    title: "Account Management",
    nav,
    errors: null
  })
}


async function triggerErrors(req, res, next) {
  throw new Error("Triggered error for testing")
}


/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}


async function buildUpdateAccount(req, res) {
  let nav = await utilities.getNav()
  const accountData = await accountModel.getAccountById(req.params.account_id)

  res.render("account/update-account", {
    title: "Update Account",
    nav,
    errors: null,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_id: accountData.account_id,
  })
}


async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email
  } = req.body

  const result = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )

  if (result) {
    const updatedAccount = await accountModel.getAccountById(account_id)
    req.flash("notice", "Account updated successfully.")

    res.render("account/index", {
      title: "Account Management",
      nav,
      accountData: updatedAccount,
      errors: null
    })
  } else {
    req.flash("notice", "Account update failed.")
    res.render("account/update-account", {
      title: "Update Account",
      nav,
      errors: null,
      ...req.body
    })
  }
}


async function updatePassword(req, res) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body

  const hashedPassword = await bcrypt.hash(account_password, 10)
  const result = await accountModel.updatePassword(hashedPassword, account_id)

  if (result) {
    const updatedAccount = await accountModel.getAccountById(account_id)
    req.flash("notice", "Password updated successfully.")

    res.render("account/index", {
      title: "Account Management",
      nav,
      accountData: updatedAccount,
      errors: null
    })
  } else {
    req.flash("notice", "Password update failed.")
    res.redirect(`/account/update/${account_id}`)
  }
}


/* ***************************
 *  Account Logout
 * ************************** */
async function accountLogout(req, res) {
  res.clearCookie("jwt")
  res.redirect("/")
}



module.exports = {
   buildLogin, 
   buildRegister, 
   triggerErrors, 
   registerAccount, 
   accountLogin, 
   buildManagement,
   buildUpdateAccount,
   updateAccount,
   updatePassword,
   accountLogout
}