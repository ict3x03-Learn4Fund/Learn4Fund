const mongoose = require('mongoose')
mongoose.set('sanitizeFilter', true)
const logsSchema = mongoose.Schema(
  {
    email: {
      type: String
    },
    type: {
      type: String,
      default: ""
    },
    reason: {
      type: String,
      default: ""
    },
    time: {
      type: String,
      default: ""
    },
    ip: {
      type: String,
      default: ""
    },
    compare: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Logs', logsSchema)