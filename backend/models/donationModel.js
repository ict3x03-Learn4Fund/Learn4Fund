const mongoose = require("mongoose");

const donationSchema = mongoose.Schema(
  {
    donationList : {
      type: Array,
      default: []
    },
    accountId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Account",
    },
    transactionId:{
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Transaction",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Donation", donationSchema);
