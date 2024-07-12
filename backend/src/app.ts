import express from 'express';
import http from 'http';
import { Server, Socket as SocketIO } from 'socket.io';
import { ChatEventEnum } from './constants';
import { ChatRoomEnum } from './constants';
import { Socket } from 'dgram';
import chatRouter from './routes/chat.route'



const app =  express();
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  pingTimeout: 6000
});

app.set('io',io); // using set method to mount the `io` instance on the app to avoid usage of `global`

// intialize socket io

io.on(ChatEventEnum.CONNECTED_EVENT, async (socket:Socket) => {
 
   try {
    console.log("User connected 🗼. ");

    // let the client know that we are connected
    socket.emit(ChatEventEnum.CONNECTED_EVENT);
    // let him join the gloabl chat
     (socket as any).join(ChatRoomEnum.GLOBAL_CHAT_ROOM);

     socket.emit(ChatEventEnum.CONNECTED_EVENT); // emit the connected event so that client is aware
     // on disconnect

     socket.on(ChatEventEnum.DISCONNECT_EVENT, () => {
      console.log("user has disconnected 🚫. ")
     });
      
      (socket as any).leave(ChatRoomEnum.GLOBAL_CHAT_ROOM);

   } catch(error) {
      socket.emit(
      ChatEventEnum.SOCKET_ERROR_EVENT,
       "Something went wrong while connecting to the socket."
    );
}
   
});

app.use('/api',chatRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

export default app;
