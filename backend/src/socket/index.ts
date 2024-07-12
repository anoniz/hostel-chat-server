import express from "express";
import { ChatEventEnum } from "../constants";
import { Server } from "socket.io";

export function emitSocketEvent<T>(req: express.Request, roomId: string, event: ChatEventEnum, payload: T): void {
    const io = req.app.get('io') as Server;
    io.to(roomId).emit(event, payload);
}