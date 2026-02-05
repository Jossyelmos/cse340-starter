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
  const classificationSelect = await utilities.buildClassificationList()

  req.flash("notice", "Welcome to inventory management.")
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    classificationSelect,
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

    formAction: "/inv/add-inventory",
    buttonText: "Add Vehicle",
    inv_id: null,                 // 👈 REQUIRED

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
    isEdit: false
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
      formAction: "/inv/add-inventory",
      buttonText: "Add Vehicle",
      inv_id: null,
      errors: null,
      isEdit: false,
      ...req.body, // 👈 THIS MAKES INPUTS STICKY
    })
  }
}


// invCont.buildEditInventory = async function (req, res, next) {
//   const inv_id = req.params.inventory_id
//   let nav = await utilities.getNav()
//   let classificationList = await utilities.buildClassificationList()

//   res.render("inventory/add-inventory", {
//     title: "Edit Inventory Item",
//     nav,
//     classificationList,
//     formAction: `/inv/update/${inv_id}`,
//     buttonText: "Update Vehicle",

//     // 👇 REQUIRED so EJS does not crash
//     inv_id,
//     inv_make: "",
//     inv_model: "",
//     inv_year: "",
//     inv_price: "",
//     inv_miles: "",
//     inv_color: "",
//     inv_description: "",

//     errors: null
//   })
// }


/* ***************************
 *  Build edit inventory view
 * ************************** */
/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inventory_id)
    let nav = await utilities.getNav()

    const itemData = await invModel.getInventoryByInventoryId(inv_id)
    const vehicle = itemData[0]

    const classificationList =
      await utilities.buildClassificationList(vehicle.classification_id)

    const itemName = `${vehicle.inv_make} ${vehicle.inv_model}`

    res.render("inventory/add-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationList,

      formAction: `/inv/update/${inv_id}`,
      buttonText: "Update Vehicle",
      errors: null,

      inv_id: vehicle.inv_id,
      inv_make: vehicle.inv_make,
      inv_model: vehicle.inv_model,
      inv_year: vehicle.inv_year,
      inv_description: vehicle.inv_description,
      inv_image: vehicle.inv_image,
      inv_thumbnail: vehicle.inv_thumbnail,
      inv_price: vehicle.inv_price,
      inv_miles: vehicle.inv_miles,
      inv_color: vehicle.inv_color,
      classification_id: vehicle.classification_id,
      isEdit: true
    })
  } catch (err) {
    next(err)
  }
}


/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}


/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.buildDeleteInventory = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inventory_id)
    let nav = await utilities.getNav()

    const itemData = await invModel.getInventoryByInventoryId(inv_id)
    const vehicle = itemData[0]

    const itemName = `${vehicle.inv_make} ${vehicle.inv_model}`

    res.render("inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,

      formAction: `/inv/delete/${inv_id}`,
      buttonText: "Delete",
      errors: null,

      inv_id: vehicle.inv_id,
      inv_make: vehicle.inv_make,
      inv_model: vehicle.inv_model,
      inv_year: vehicle.inv_year,
      inv_price: vehicle.inv_price,
    })
  } catch (err) {
    next(err)
  }
}


/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
  } = req.body
  const deleteResult = await invModel.deleteInventory(inv_id)

  if (deleteResult) {
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id,
    })
  }
}


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


invCont.triggerErrors = async function (req, res, next) {
  throw new Error("This is an intentional error for testing - No fuse!"); 
}

module.exports = invCont