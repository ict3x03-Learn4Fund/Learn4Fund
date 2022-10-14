const mongoose = require('mongoose')

const logsSchema = mongoose.Schema(
  {
    email: {
      type: String,      
      unique: true
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
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Logs', logsSchema)