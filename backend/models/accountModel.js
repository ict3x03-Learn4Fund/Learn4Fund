const mongoose = require('mongoose')

const accountSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please add an email."],
      unique: true,
    },
    authyId: {
      type: String,
      default: ""
    },
      avatarImg: {
      data: Buffer,
      type: String,
      default: ""
    },
    password: {
      type: String,
      min: [12, "Please enter at least 12 characters"],
      required: [true, "Please add a password"],
    },
    donation: {
        type: mongoose.SchemaTypes.ObjectId,
    },
    firstName: {
        type: String,
        required: [true, "Please add a first name"],
    },
    lastName: {
        type: String,
        required: [true, "Please add a last name"],
    },
    emailSubscription: {
        type: Boolean,
        default: false,
    },
    lockedOut: {
        type: Boolean,
        default: false,
    },
    loginTimes: {
        type: Number,
        default: 0,
    },
    role: {
        type: String,
        default: "user",
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Account', accountSchema)