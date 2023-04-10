import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  access_token: {
    type: String,
    required: true,
    unique: true,
  },
});

const Token = mongoose.model("token", tokenSchema);
export default Token;
