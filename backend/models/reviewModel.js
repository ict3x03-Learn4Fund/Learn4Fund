const mongoose = require('mongoose')
mongoose.set('sanitizeFilter', true)
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
        ref: "Account",
    },
    courseId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Course"
    },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Review', reviewSchema)