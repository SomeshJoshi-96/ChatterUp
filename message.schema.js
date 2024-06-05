import mongoose from "mongoose";

function getTimeInHoursAndMinutes() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

const messageSchema = new mongoose.Schema({
  username: String,
  text: String,
  timestamp: {
    type: String,
    default: getTimeInHoursAndMinutes,
  },
  avatarURL: String,
});

export const messageModel = mongoose.model("ChatterUpMessage", messageSchema);
