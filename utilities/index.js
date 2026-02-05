const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  let data = await invModel.getClassifications()
  let list = "<ul class='navigation'>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="/inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + ' details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" ></a>'
      grid += '<div class="namePrice">'
      grid += '<hr >'
      grid += '<h2>'
      grid += '<a href="/inv/detail/' + vehicle.inv_id +'" title="View '  
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'  
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$'  
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}


/* **************************************
* Build the inventory detail HTML
* ************************************ */
Util.buildInventoryDetail = async function(data) {
  let detail = ""
  if (data.length > 0) {
    const item = data[0]
    detail = `
      <div class="vehicle-detail">
        <img src="${item.inv_image}" alt="Image of ${item.inv_make} ${item.inv_model}" class="vehicle-image">
        <div class="vehicle-info">
          <h1>${item.inv_year} ${item.inv_make} ${item.inv_model}</h1>
          <div class="vehicle-subInfo">
            <p class="price"><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(item.inv_price)}</p>
            <p><strong>Description:</strong> ${item.inv_description}</p>
            <p class="color"><strong>Color:</strong> ${item.inv_color}</p>
            <p><strong>Mileage:</strong> ${new Intl.NumberFormat('en-US').format(item.inv_miles)} miles</p>
          </div>
        </div>
      </div>
    `
  } else {
    detail = "<p class='notice'>Sorry, vehicle not found.</p>"
  }
  return detail
}


Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"

  data.rows.forEach((row) => {
    classificationList += `<option value="${row.classification_id}"`
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected"
    }
    classificationList += `>${row.classification_name}</option>`
  })

  classificationList += "</select>"
  return classificationList
}


/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  res.locals.loggedin = 0

 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }


 /* ****************************************
 *  Check Account Type (Employee | Admin)
 * ************************************ */
Util.checkAccountType = (req, res, next) => {
  if (res.locals.loggedin &&
    (res.locals.accountData.account_type === "Employee" ||
    res.locals.accountData.account_type === "Admin")
  ) {
    return next()
  }
  req.flash("notice", "You must be logged in as an employee or administrator to access this page.")
  return res.redirect("/account/login")
} 



/* ****************************************
 * Middleware For Handling Errors
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util