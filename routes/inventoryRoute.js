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

router.get(
  "/", 
  utilities.checkLogin, 
  utilities.checkAccountType, 
  utilities.handleErrors(invController.buildManagementView)
)

router.get('/trigger-error', utilities.handleErrors(invController.triggerErrors))

router.get(
  "/add-classification",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddClassification)
)

router.post(
  "/add-classification",
  utilities.checkLogin,
  utilities.checkAccountType,
  classificationValidate.classificationRules(),
  classificationValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)


// Add Inventory View
router.get(
  "/add-inventory",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddInventory)
)

// Process Inventory Addition
router.post(
  "/add-inventory",
  utilities.checkLogin,
  utilities.checkAccountType,
  inventoryValidate.inventoryRules(),
  inventoryValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)


router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
)

router.get(
  "/edit/:inventory_id", 
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildEditInventory))

// Process Inventory Update
router.post(
  "/update/:inventory_id",
  utilities.checkLogin,
  utilities.checkAccountType,
  inventoryValidate.inventoryRules(),
  inventoryValidate.checkInventoryData,
  utilities.handleErrors(invController.updateInventory)
)

router.get(
  "/delete/:inventory_id",
  utilities.checkLogin,
  utilities.checkAccountType, 
  utilities.handleErrors(invController.buildDeleteInventory)
)

router.post(
  "/delete/:inventory_id", 
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.deleteInventory)

)


module.exports = router