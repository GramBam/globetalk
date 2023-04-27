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
    last_message: {
      content: String,
      read_by: [String],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Convo", convoSchema);
