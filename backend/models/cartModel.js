const mongoose = require('mongoose')

const cartItem = mongoose.Schema({
  courseId: mongoose.SchemaTypes.ObjectId,
  quantity: Number,
})

const cartModel = mongoose.Schema(
  {
    coursesAdded: {
      type: Array,
      default: [],
    },
    paymentCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Cart', cartModel)