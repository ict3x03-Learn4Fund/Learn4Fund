const mongoose = require('mongoose')
mongoose.set('sanitizeFilter', true)
const billAddressSchema = mongoose.Schema(
  {
    accountId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Account"
    },
    firstName: {
      type: String,
      default: "",
    },
    lastName: {
      type: String,
      default: "",
    },
    address: {
        type: String,
        default: ""
    },
    unit: {
        type: String,
        defualt: ""
    },
    city: {
        type: String,
        default: "Singapore"
    },
    postalCode: {
        type: Number,
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('BillAddress', billAddressSchema)