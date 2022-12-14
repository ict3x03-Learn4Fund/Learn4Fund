const mongoose = require('mongoose')
mongoose.set('sanitizeFilter', true)
const creditCardSchema = mongoose.Schema(
  {
    accountId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Account",
    },
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