const mongoose = require('mongoose')

const companySchema = mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, "Please add a text value"],
    },
    companyImg: {
      data: Buffer,
      type: String,
    },
    companyAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Company', companySchema)
