import { Server } from "socket.io";
import { createServer } from "http";
import app from "./app";

const server = createServer(app);

const io = new Server(server);

let socketObj:{[id:string]:any};

io.on("connection", (socket) => {
    socket.send("Connected to server");
    
    // socketObj[re]=socket


    socket.on("message",(data)=>{
        console.log(data);        
    })
  socket.on("disconnect", () => {
  //  delete socketObj[id]
    console.log("user disconnected");
  });
});

export default server;
