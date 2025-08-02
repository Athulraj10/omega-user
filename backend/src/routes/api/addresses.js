const router = require("express").Router();
const { userTokenAuth } = require("../../middlewares/user");
const addressController = require("../../controllers/app/addressController");
const AddressValidation = require("../../services/AddressValidation");

// Get all addresses for the authenticated user
router.get("/", userTokenAuth, addressController.getUserAddresses);

// Create a new address
router.post("/", userTokenAuth, (req, res) => {
  AddressValidation.createAddressValidation(req, res, async (validate) => {
    if (validate) {
      await addressController.createAddress(req, res);
    }
  });
});

// Update an address
router.put("/:id", userTokenAuth, (req, res) => {
  AddressValidation.addressIdValidation(req, res, (validateId) => {
    if (validateId) {
      AddressValidation.updateAddressValidation(req, res, async (validate) => {
        if (validate) {
          await addressController.updateAddress(req, res);
        }
      });
    }
  });
});

// Delete an address
router.delete("/:id", userTokenAuth, (req, res) => {
  AddressValidation.addressIdValidation(req, res, async (validate) => {
    if (validate) {
      await addressController.deleteAddress(req, res);
    }
  });
});

// Set address as default
router.patch("/:id/default", userTokenAuth, (req, res) => {
  AddressValidation.addressIdValidation(req, res, async (validate) => {
    if (validate) {
      await addressController.setDefaultAddress(req, res);
    }
  });
});

module.exports = router; 