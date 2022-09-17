import mongoose from "mongoose";

const companySchema = mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, "Please add a text value"],
    },
    companyImg: {
      data: Buffer,
      type: String,
    },
    companyAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Company', companySchema)
