const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId
  const data = await invModel.getInventoryByInventoryId(inventory_id)
  const detail = await utilities.buildInventoryDetail(data)
  let nav = await utilities.getNav()
  const vehicle = data[0] // single vehicle object
  res.render("./inventory/detail", {
    title: `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
    nav,
    detail
  })
}


invCont.buildManagementView = async function(req, res, next) {
  let nav = await utilities.getNav()
  req.flash("notice", "Welcome to inventory management.")
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
  })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res) {
  let nav = await utilities.getNav()

  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null
  })

}

invCont.addClassification = async function (req, res) {
  const {classification_name} = req.body
  const result = await invModel.addClassification(classification_name)

  if (result) {
    req.flash("notice", "Classification added successfully.")

    let nav = await utilities.getNav()
    res.render("inventory/management", {
      title: "Vehicle Management",
      nav,
    })
    
  } else {
    req.flash("notice", "Failed to add classification")
    res.redirect("/inv/add-classification")
  }
}


invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()

  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,

    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_description: "",
    inv_image: "/images/vehicles/no-image.png",
    inv_thumbnail: "/images/vehicles/no-image.png",
    inv_price: "",
    inv_miles: "",
    inv_color: "",
    classification_id: "",
  })
}


invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList(
    req.body.classification_id
  )

  const result = await invModel.addInventory(req.body)

  if (result) {
    req.flash("notice", "Vehicle successfully added.")
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the vehicle could not be added.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: null,
      ...req.body, // 👈 THIS MAKES INPUTS STICKY
    })
  }
}



invCont.triggerErrors = async function (req, res, next) {
  throw new Error("This is an intentional error for testing - No fuse!"); 
}

module.exports = invCont