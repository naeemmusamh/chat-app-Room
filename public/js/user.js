"use strict";

const chatForm = document.getElementById("chat-form");
const chatMessage = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userLIst = document.getElementById("users");

//to get the user name and the room from the URL that path in the (localhost:)
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

console.log(username, room);

const socket = io();

//to return it in the server file and user when the user inter the room
socket.emit("joinRoom", { username, room });

//to have all the info about the user and room he have enter
socket.on("roomUsers", ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

//it will call the message from the server file and work it
socket.on("message", (message) => {
    console.log(message);
    outputMessage(message);

    //when the message appear in the box and the box in full i want to scroll down auto
    chatMessage.scrollTop = chatMessage.scrollHeight;
});

chatForm.addEventListener("submit", (event) => {
    event.preventDefault();

    //to make the form text appear when send message
    const messageChat = event.target.elements.msg.value;
    //to connect the chat box to server
    socket.emit("chatMessage", messageChat);

    //to clear the input message when i send the message(don't want to see the text is steal in the input)
    event.target.elements.msg.value = "";
    event.target.elements.msg.focus();
});

//make the output message in the dom
function outputMessage(message) {
    //create new div
    const div = document.createElement("div");
    //make this div appear in the HTML box of the message be call it with class
    div.classList.add("message");
    div.innerHTML = `<p class="meta">${message.userName}<span>${message.time}</span></p>
                    <p class="text">
                        ${message.text}
                    </p>`;
    //to make the message and the new user when connect appear in the box container (chat-message)
    document.querySelector(".chat-messages").appendChild(div);
}

//add room name for the DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

//add user name for the DOM
function outputUsers(users) {
    userLIst.innerHTML = `
    ${users.map((user) => `<li>${user.username}</li>`).join("")}
    `;
}