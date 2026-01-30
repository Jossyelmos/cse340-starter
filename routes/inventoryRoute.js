// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const classificationValidate = require("../utilities/classification-validation")
const inventoryValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build inventory detail view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId))

router.get("/", utilities.handleErrors(invController.buildManagementView))

router.get('/trigger-error', utilities.handleErrors(invController.triggerErrors))

router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
)

router.post(
  "/add-classification",
  classificationValidate.classificationRules(),
  classificationValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)


// Add Inventory View
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
)

// Process Inventory Addition
router.post(
  "/add-inventory",
  inventoryValidate.inventoryRules(),
  inventoryValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)



module.exports = router