const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      default: 4.0,
    },
    description: {
      type: String,
      default: "",
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

module.exports = mongoose.model('Review', reviewSchema)