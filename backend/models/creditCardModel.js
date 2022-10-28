const mongoose = require('mongoose')

const creditCardSchema = mongoose.Schema(
  {
    accountId: mongoose.SchemaTypes.ObjectId,
    name: {
      type: String,
      default: "",
    },
    cardNo: {
      type: String,
    },
    last4No: {
      type: String,
    },
    cardType: {
      type: String,
    },
    expiryDate: {
      type: String,
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('CreditCard', creditCardSchema)