import mongoose from "mongoose";
const Schema = mongoose.Schema;

const convoSchema = new Schema(
  {
    members: {
      type: [
        {
          username: String,
          email: String,
          id: String,
          avatar: String,
        },
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Convo", convoSchema);
