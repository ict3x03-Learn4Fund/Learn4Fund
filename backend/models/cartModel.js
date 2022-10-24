const mongoose = require("mongoose");



const cartModel = mongoose.Schema(
  {
    accountId: mongoose.SchemaTypes.ObjectId,
    coursesAdded: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cart", cartModel);
