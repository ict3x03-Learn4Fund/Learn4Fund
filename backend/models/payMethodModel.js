const mongoose = require('mongoose')

const payMethodSchema = mongoose.Schema(    
  {
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "AccountId cannot be empty"],
      },
    methods: {
        type: Array,
        default: [],
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('PayMethod', payMethodSchema)