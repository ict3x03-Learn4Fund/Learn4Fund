var mongoose = require("mongoose")
require('mongoose-double')(mongoose);

var SchemaTypes = mongoose.Schema.Types;
const courseSchema = mongoose.Schema(
  {
    courseName: {
      type: String,
      required: [true, "Please add a course name."],
    },
    courseImg: {
      data: Buffer,
      type: String,
    },
    courseOriginalPrice: {
      type: SchemaTypes.Double,
      required: [true, "Please enter a price."]
    },
    courseDiscountedPrice: {
      type: SchemaTypes.Double,
      default: 0,
    },
    canBeDiscounted: {
      type: Boolean,
      default: false,
    },
    courseType: {
      type: String,
      default: "",
    },
    courseDescription: {
      type: String,
      default: "",
    },
    courseTutor: {
      type: String,
      default: "",
    },
    quantity: {
      type: Number,
      default: 1,
    },
    deleteIndicator: {
        type: Boolean,
        default: false,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);
