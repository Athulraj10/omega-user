const { Address } = require("../../models");
const { sanitizeAddress } = require("../../services/Helper");
const Response = require("../../services/Response");
const { SUCCESS } = require("../../services/Constants");

const addressController = {
  /**
   * @description "Get all addresses for the authenticated user"
   * @param req
   * @param res
   */
  getUserAddresses: async (req, res) => {
    try {
      const userId = req.user._id;
      
      const addresses = await Address.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 });
      
      const sanitizedAddresses = addresses.map(address => sanitizeAddress(address.toObject()));
      
      return Response.successResponseData(
        res,
        sanitizedAddresses,
        SUCCESS,
        res.__('AddressesFetchedSuccessfully')
      );
    } catch (error) {
      console.log("Error in getUserAddresses:", error);
      return Response.errorResponseData(
        res,
        res.__('internalError'),
        error
      );
    }
  },

  /**
   * @description "Create a new address for the authenticated user"
   * @param req
   * @param res
   */
  createAddress: async (req, res) => {
    try {
      const userId = req.user._id;
      const requestParams = req.body;

      // Check if this will be the first address (make it default)
      const existingAddresses = await Address.find({ user: userId });
      const isFirstAddress = existingAddresses.length === 0;

      // If setting as default, unset other default addresses
      if (requestParams.isDefault || isFirstAddress) {
        await Address.updateMany(
          { user: userId, isDefault: true },
          { isDefault: false }
        );
      }

      const addressData = {
        user: userId,
        label: requestParams.label || 'Home',
        addressLine1: requestParams.addressLine1,
        addressLine2: requestParams.addressLine2,
        city: requestParams.city,
        state: requestParams.state,
        postalCode: requestParams.postalCode,
        country: requestParams.country,
        phone: requestParams.phone,
        isDefault: requestParams.isDefault || isFirstAddress
      };

      const address = await Address.create(addressData);
      
      const sanitizedAddress = sanitizeAddress(address.toObject());
      
      return Response.successResponseData(
        res,
        sanitizedAddress,
        SUCCESS,
        res.__('AddressCreatedSuccessfully')
      );
    } catch (error) {
      console.log("Error in createAddress:", error);
      return Response.errorResponseData(
        res,
        res.__('internalError'),
        error
      );
    }
  },

  /**
   * @description "Update an existing address"
   * @param req
   * @param res
   */
  updateAddress: async (req, res) => {
    try {
      const userId = req.user._id;
      const addressId = req.params.id;
      const requestParams = req.body;

      // Check if address exists and belongs to user
      const existingAddress = await Address.findOne({ _id: addressId, user: userId });
      if (!existingAddress) {
        return Response.errorResponseData(
          res,
          res.__('AddressNotFound'),
          404
        );
      }

      // If setting as default, unset other default addresses
      if (requestParams.isDefault) {
        await Address.updateMany(
          { user: userId, _id: { $ne: addressId }, isDefault: true },
          { isDefault: false }
        );
      }

      const updateData = {};
      if (requestParams.label !== undefined) updateData.label = requestParams.label;
      if (requestParams.addressLine1 !== undefined) updateData.addressLine1 = requestParams.addressLine1;
      if (requestParams.addressLine2 !== undefined) updateData.addressLine2 = requestParams.addressLine2;
      if (requestParams.city !== undefined) updateData.city = requestParams.city;
      if (requestParams.state !== undefined) updateData.state = requestParams.state;
      if (requestParams.postalCode !== undefined) updateData.postalCode = requestParams.postalCode;
      if (requestParams.country !== undefined) updateData.country = requestParams.country;
      if (requestParams.phone !== undefined) updateData.phone = requestParams.phone;
      if (requestParams.isDefault !== undefined) updateData.isDefault = requestParams.isDefault;

      const updatedAddress = await Address.findByIdAndUpdate(
        addressId,
        updateData,
        { new: true }
      );

      const sanitizedAddress = sanitizeAddress(updatedAddress.toObject());
      
      return Response.successResponseData(
        res,
        sanitizedAddress,
        SUCCESS,
        res.__('AddressUpdatedSuccessfully')
      );
    } catch (error) {
      console.log("Error in updateAddress:", error);
      return Response.errorResponseData(
        res,
        res.__('internalError'),
        error
      );
    }
  },

  /**
   * @description "Delete an address"
   * @param req
   * @param res
   */
  deleteAddress: async (req, res) => {
    try {
      const userId = req.user._id;
      const addressId = req.params.id;

      // Check if address exists and belongs to user
      const existingAddress = await Address.findOne({ _id: addressId, user: userId });
      if (!existingAddress) {
        return Response.errorResponseData(
          res,
          res.__('AddressNotFound'),
          404
        );
      }

      // If deleting default address, set another address as default
      if (existingAddress.isDefault) {
        const otherAddress = await Address.findOne({ user: userId, _id: { $ne: addressId } });
        if (otherAddress) {
          await Address.findByIdAndUpdate(otherAddress._id, { isDefault: true });
        }
      }

      await Address.findByIdAndDelete(addressId);
      
      return Response.successResponseData(
        res,
        {},
        SUCCESS,
        res.__('AddressDeletedSuccessfully')
      );
    } catch (error) {
      console.log("Error in deleteAddress:", error);
      return Response.errorResponseData(
        res,
        res.__('internalError'),
        error
      );
    }
  },

  /**
   * @description "Set an address as default"
   * @param req
   * @param res
   */
  setDefaultAddress: async (req, res) => {
    try {
      const userId = req.user._id;
      const addressId = req.params.id;

      // Check if address exists and belongs to user
      const existingAddress = await Address.findOne({ _id: addressId, user: userId });
      if (!existingAddress) {
        return Response.errorResponseData(
          res,
          res.__('AddressNotFound'),
          404
        );
      }

      // Unset all other default addresses
      await Address.updateMany(
        { user: userId, _id: { $ne: addressId } },
        { isDefault: false }
      );

      // Set this address as default
      const updatedAddress = await Address.findByIdAndUpdate(
        addressId,
        { isDefault: true },
        { new: true }
      );

      const sanitizedAddress = sanitizeAddress(updatedAddress.toObject());
      
      return Response.successResponseData(
        res,
        sanitizedAddress,
        SUCCESS,
        res.__('DefaultAddressSetSuccessfully')
      );
    } catch (error) {
      console.log("Error in setDefaultAddress:", error);
      return Response.errorResponseData(
        res,
        res.__('internalError'),
        error
      );
    }
  }
};

module.exports = addressController; 