import mongoose from "mongoose";

const featureSchema = new mongoose.Schema({
  toggleStudentUpdateValue: {
    type: Boolean,
    default: false,
  },

  adminData: [
    {
      adminName: {
        type: String,
        required: true,
      },
      adminEmail: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
  ],
});

export const Feature = mongoose.model("Feature", featureSchema);
