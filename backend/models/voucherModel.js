const mongoose = require('mongoose')

const voucherSchema = mongoose.Schema(
  {
    voucherCode: {
      type: String,
      default: false,
    },
    expiryDate: {
      type: Date,
      default: setExpiryDate(),
    },
    accountId: {
        type: mongoose.SchemaTypes.ObjectId,
    },
    courseId: {
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

module.exports = mongoose.model('Voucher', voucherSchema)