const mongoose = require('mongoose')

const creditCardSchema = mongoose.Schema(
  {
    showDonation: {
      type: Boolean,
      default: false,
    },
    totalAmount: {
      type: mongoose.Schema.Types.Double,
      default: 0.0,
    },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('CreditCard', creditCardSchema)