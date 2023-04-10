import mongoose from "mongoose";
const DB_URL = process.env.DB_URL;

const connect = async () => {
  try {
    if (!DB_URL) {
      throw new Error("invalid db url.");
    }
    await mongoose
      .connect(DB_URL)
      .then(() => console.log("db connected successfully"));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
export default connect;
