const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    label: {
        type: String,
        maxLength: 50,
        enum: ["Home", "Work", "Other"],
        default: "Home"
    },
    addressLine1: {
        type: Object,
        maxLength: 200,
        required: true
    },
    city: {
        type: String,
        maxLength: 100,
        default:'default'
    },
    state: {
        type: String,
        maxLength: 100,
        default:"default"
    },
    postalCode: {
        type: String,
        maxLength: 20,
        default:"default"
    },
    country: {
        type: String,
        maxLength: 100,
        default:"default"
    },
    phone: {
        type: String,
        maxLength: 20
    },
    isDefault: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

addressSchema.index(
  { userId: 1, isDefault: 1 },
  { unique: true, partialFilterExpression: { isDefault: true } }
);



const Address = mongoose.model("Address", addressSchema);

module.exports = Address;