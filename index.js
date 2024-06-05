import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { messageModel } from "./message.schema.js";

export const app = express();
app.use(cors());

export const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

var onlineMembers = [];
var imageNumber = 0;

io.on("connection", (socket) => {
  console.log("Connection made.");

  socket.on("join", async (data) => {
    try {
      console.log(data);
      socket.imageNumber = imageNumber;
      imageNumber = imageNumber + 1;
      socket.avatarURL = `https://i.pravatar.cc/300?img=${socket.imageNumber}`;
      socket.username = data.username;
      onlineMembers.push(socket.username);
      onlineMembers = onlineMembers.filter((element) => element !== null);
      socket.emit("new_join", {
        onlineMembers: onlineMembers,
        userAvataruRL: socket.avatarURL,
      });
      socket.broadcast.emit("new_join_member", {
        newMember: socket.username,
      });
      const messages = await messageModel.find().sort({ timestamp: 1 }).limit(30);
      console.log(messages)
      socket.emit("load_messages", messages);
    } catch (err) {
      console.error(err);
    }
  });
  socket.on("isTyping",async(name)=>{
    console.log(name)
    socket.broadcast.emit("someoneIsTyping",name)
  })
  socket.on("new_message", async (message) => {
    try {
      let newMessage = new messageModel({
        username: socket.username,
        text: message,
        avatarURL: socket.avatarURL,
      });
      newMessage = await newMessage.save();
      io.emit("add_new_message", newMessage);
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("disconnect", () => {
    io.emit("memberDisconnected",socket.username)
    console.log("Connection disconnected.");
  });
});
