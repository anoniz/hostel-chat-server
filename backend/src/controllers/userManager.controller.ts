import UserManager from "../services/userManager.service";
import User from "../../../shared/types/user";
import { Request, Response } from "express";
import MessageManager from "../services/messageManager.service";
import { emitSocketEvent } from "../socket";
import { ChatRoomEnum } from "../constants";
import { ChatEventEnum } from "../constants";


export default class UserController {
    private userManager: UserManager;
    private messageManager: MessageManager;

    constructor() {
        this.userManager = new UserManager();
        this.messageManager = new MessageManager();
    }

    public createUser(req: Request, res: Response): void {
        const { username, /* other properties */ } = req.body; // Assuming username and other properties are sent in the request body
        const newUser: User = { username, /* other properties */ };

        const added = this.userManager.addUser(newUser);

        if (added) {
            
            res.status(201).json({ message: 'User created successfully', user: newUser });
        } else {
            res.status(400).json({ message: 'User already exists', username });
        }
    }

    public getUser(req: Request, res: Response): void {
        const { username } = req.params; 

        const user = this.userManager.getUser(username);

        if (user) {
            res.status(200).json({ user });
        } else {
            res.status(404).json({ message: 'User not found', username });
        }
    }

    public deleteUser(req: Request, res: Response): void {
        const { username } = req.params; 

        const user = this.userManager.getUser(username);

        if (user) {
            this.userManager.removeUser(user);
            res.status(200).json({ message: 'User deleted successfully', user });
        } else {
            res.status(404).json({ message: 'User not found', username });
        }
    }

    public getMessagesForToday(req: Request, res: Response): void {
        const messages = this.messageManager.getAllMessagesForToday();

        res.status(200).json({ messages });
    }

    public sendMessage(req: Request, res: Response): void {
        const {username, message} = req.body;
        const user = this.userManager.getUser(username);
        if (user) {
            this.messageManager.sendMessage(user, message);

            // Emit the new message to all connected clients in the same room\
            emitSocketEvent(req,ChatRoomEnum.GLOBAL_CHAT_ROOM,
                ChatEventEnum.MESSAGE_RECEIVED_EVENT,message);

            res.status(201).json({ message: 'Message sent successfully' });
        }
    }

    public getUsers(req: Request, res: Response): void {
        const users = this.userManager.getAllUsers();

        res.status(200).json({ users });
    }
}


