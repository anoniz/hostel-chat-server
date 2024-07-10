import express from 'express';
import http from 'http';
import socketIo from 'socket.io';

const app =  express();
const server = http.createServer(app);
const io = new socketIo.Server(server);


app.get('/', (req, res) => {
  res.send('Hello World!');
});

export default app;
