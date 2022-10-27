const mongoose = require('mongoose')

const voucherSchema = mongoose.Schema(
  {
    voucherCode: {
      type: String,
      default: false,
    },
    expiryDate: {
      type: Date,
      default: () => new Date(+ new Date() + 365*24*60*60*1000)
    },
    accountId: {
        type: mongoose.SchemaTypes.ObjectId,
    },
    courseId: {
        type: mongoose.SchemaTypes.ObjectId,
    },
    transactionId: {
        type: mongoose.SchemaTypes.ObjectId,
    },
  },
  {
    timestamps: true
  }
);


module.exports = mongoose.model('Voucher', voucherSchema)