const { body, validationResult } = require("express-validator")
const utilities = require("../utilities")

const inventoryRules = () => {
  return [
    body("inv_make").trim().notEmpty().withMessage("Make is required."),
    body("inv_model").trim().notEmpty().withMessage("Model is required."),
    body("inv_price").isNumeric().withMessage("Price must be numeric."),
    body("inv_year").isInt({ min: 1900 }).withMessage("Invalid year."),
    body("inv_description").notEmpty().withMessage("Description required."),
    body("inv_miles").isNumeric().withMessage("Mileage must be numeric."),
    body("inv_color").notEmpty().withMessage("Color required."),
    body("classification_id").notEmpty().withMessage("Choose a classification."),
  ]
}


const checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(
      req.body.classification_id
    )

    const inv_id = req.body.inv_id || null

    res.render("inventory/add-inventory", {
      title: inv_id ? "Edit Inventory" : "Add Inventory",
      nav,
      classificationList,

      formAction: inv_id
        ? `/inv/update/${inv_id}`
        : "/inv/add-inventory",

      buttonText: inv_id ? "Update Vehicle" : "Add Vehicle",
      inv_id,

      errors,
      ...req.body,
    })

    return
  }

  next()
}




module.exports = {
  inventoryRules,
  checkInventoryData,
}
