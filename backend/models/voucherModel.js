const mongoose = require('mongoose')
mongoose.set('sanitizeFilter', true)
const voucherSchema = mongoose.Schema(
  {
    voucherCode: {
      type: String,
    },
    expiryDate: {
      type: Date,
      default: () => new Date(+ new Date() + 365 * 24 * 60 * 60 * 1000)
    },
    accountId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Account"
    },
    courseId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Course"
    },
    transactionId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Transaction"
    },
    salt: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);


module.exports = mongoose.model('Voucher', voucherSchema)