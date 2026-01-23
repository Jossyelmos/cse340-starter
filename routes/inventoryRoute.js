// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)

// Route to build inventory detail view
router.get("/detail/:inventoryId", invController.buildByInventoryId)

router.get('/trigger-error', utilities.handleErrors(invController.triggerErrors))

module.exports = router