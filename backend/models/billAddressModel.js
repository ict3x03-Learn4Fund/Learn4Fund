const mongoose = require('mongoose')

const billAddressSchema = mongoose.Schema(
  {
    accountId: mongoose.SchemaTypes.ObjectId,
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