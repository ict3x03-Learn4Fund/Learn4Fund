const mongoose = require('mongoose')

const transactionSchema = mongoose.Schema(
  {
    donationAmount: {
      type: mongoose.Schema.Types.Double,
      default: 0.0,
    },
    totalAmount: {
      type: mongoose.Schema.Types.Double,
      required: [true, "Total amount cannot be null."]
    },
    checkedOutCart: Array,
    voucherLists: {
        type: Array,
        default: [],
    },
    accountId: {
        type: mongoose.SchemaTypes.ObjectId,
    },
  },
  {
    timestamps: true
  }
);

const setExpiryDate = () => {
  const date = Date.now()
  const newDate = date.setFullYear(date.getFullYear() + 1)
  return newDate
}

module.exports = mongoose.model('Transaction', transactionSchema)