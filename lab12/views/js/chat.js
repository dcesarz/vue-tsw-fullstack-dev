// Query DOM 
const messageContent = document.getElementById("message-content"),
      btn            = document.getElementById("btn-send"),
      output         = document.getElementById("output"),
      roomName       = document.getElementById("room-name").innerHTML;

// Make connection
const socket = io.connect();

// Emit events
btn.addEventListener("click", () => {
    socket.emit("chatMessage", {
        content: messageContent.value,
        roomName: roomName
    });
    
});

// Listen for events
socket.on("chatMessage", async (data) => {
    output.innerHTML += "<p><strong>" + data.handle + 
    ":&nbsp</strong>" + data.content + "</p>";
});
