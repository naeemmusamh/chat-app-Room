"use strict";

//require all the package
//dotenv
require("dotenv").config();
//express
const express = require("express");
//path for the html and css and js file
const path = require("path");
//to make the server listen for the socket
const http = require("http");
//socket io
const socketio = require("socket.io");

const app = express();
//the port the server will listen for it
const PORT = process.env.PORT || 5565;

const server = http.createServer(app);
const io = socketio(server);
//require the file message to set the time when the message it appear in the box and submit
const formatMessage = require("./src/messages.js");
const userName = "new user";
//require the file user to set the user name when the user enter the room
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
} = require("./src/users.js");

//to read all the file in side the public folder (HTML CSS JS)
app.use(express.static(path.join(__dirname, "public")));

//when the new user connect for the app and sign in on the room
io.on("connection", (socket) => {
    console.log("new user Connection.....🧍");

    socket.on("joinRoom", ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);
        //when the user enter the room (to send just for the user)
        socket.emit("message", formatMessage(user.username, "Welcome to the app"));

        //when the user enter the room (to send just for the another user)
        socket.broadcast
            .to(user.room)
            .emit(
                "message",
                formatMessage(user.username, `${user.username} join the chat`)
            );

        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
        });
    });

    //when the user leave the room or close the app
    socket.on("disconnect", () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit(
                "message",
                formatMessage(user.username, `${user.username} left the chat`)
            );
            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomUsers(user.room),
            });
        }
    });

    //when send message to appear in the server side
    socket.on("chatMessage", (message) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit("message", formatMessage(user.username, message));
    });
});

server.listen(PORT, () => {
    console.log(`i'm listen for the port ${PORT} 👨‍💻`);
});