const utilities = require("../utilities")
const { body, validationResult } = require("express-validator")

const validate = {}

validate.classificationRules = () => [
    body("classification_name")
    .trim()
    .matches(/^[A-Za-z0-9]+$/)
    .withMessage("Classification name cannot contain spaces or special characters.")
]

validate.checkClassificationData = async (req, res, next) => {
    const errors = validationResult(req)
    let nav = await utilities.getNav()

    if (!errors.isEmpty()) {
        res.render("inventory/add-classification", {
            title: "Add New Classification",
            nav,
            errors,
        })
        return
    }
    next()
}

module.exports = validate