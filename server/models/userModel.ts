import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: { type: String, required: [true, "Please add a username"] },
    email: {
      type: String,
      required: [true, "Please add a email"],
      unique: true,
    },
    password: { type: String, required: [true, "Please add a password"] },
    avatar: {
      type: String,
      default: `https://robohash.org/${Math.random()}`,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
