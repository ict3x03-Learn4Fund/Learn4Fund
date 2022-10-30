const mongoose = require("mongoose");
mongoose.set('sanitizeFilter', true)


const cartModel = mongoose.Schema(
  {
    accountId: mongoose.SchemaTypes.ObjectId,
    coursesAdded: {
      type: Array,
      default: [],
    },
    donationAmt: {
      type: Number,
      default: 0,
    },
    showDonation: {
      type: Boolean,
      default: false, 
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cart", cartModel);
