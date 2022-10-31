const mongoose = require("mongoose");
mongoose.set('sanitizeFilter', true)

const transactionSchema = mongoose.Schema(
  {
    donationAmount: {
      type: mongoose.Schema.Types.Double,
      default: 0.0,
    },
    totalAmount: {
      type: mongoose.Schema.Types.Double,
      required: [true, "Total amount cannot be null."],
    },
    last4No: {
      type: String,
      default: ""
    },
    cardType: {
      type: String,
      default: ""
    },
    checkedOutCart: Array,
    accountId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Account'
    },
    cardId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'CreditCard'
    },
    billAddressId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'BillAddress'
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);
