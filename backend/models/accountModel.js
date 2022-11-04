const mongoose = require('mongoose')
mongoose.set('sanitizeFilter', true)

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
    temp_secret: {
      type: Object,
      default: ""
    },
    secret: {
      type: Object,
      default: ""
    },
    avatarImg: {
      type: String,
      default: ""
    },
    password: {
      type: String,
      min: [12, "Please enter at least 12 characters"],
      required: [true, "Please add a password"],
    },
    donationId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Donation'
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
    loggedTimestamp: {
      type: Date,
      default: Date.now
    },
    ipAddress: {
      type: String,
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