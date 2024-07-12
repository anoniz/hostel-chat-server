import fs from 'fs';
import path from 'path';
import User from '../../../shared/types/user';
import Message from '../../../shared/types/message';

export default class MessageManager {
    private messagesDirPath: string;
    private messagesBuffer: Message[];
    private static readonly MAX_BUFFER_SIZE = 1000; // Maximum number of messages to buffer before writing

    constructor() {
        // Define the directory where messages will be stored (relative to the backend folder)
        this.messagesDirPath = path.join(__dirname, '..', '..', 'messages');
        // Ensure the directory exists
        if (!fs.existsSync(this.messagesDirPath)) {
            fs.mkdirSync(this.messagesDirPath);
        }
        // Initialize messages buffer
        this.messagesBuffer = [];
    }

    public sendMessage(user: User, message: string): void {
        // Construct the new message object
        const newMessage: Message = {
            username: user.username,
            message: message,
            timestamp: Date.now(),
        };

        // Add the message to the buffer
        this.messagesBuffer.push(newMessage);

        // Check if buffer size exceeds the maximum threshold
        if (this.messagesBuffer.length >= MessageManager.MAX_BUFFER_SIZE) {
            this.flushMessagesBuffer(); // Flush messages to file
        }
    }

    private flushMessagesBuffer(): void {
        const currentDate = new Date();
        const fileName = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}.json`;
        const filePath = path.join(this.messagesDirPath, fileName);

        // Append messages from buffer to the file
        const messagesToAppend = this.messagesBuffer.map(msg => JSON.stringify(msg) + '\n').join('');
        fs.appendFileSync(filePath, messagesToAppend);

        // Clear the buffer after flushing
        this.messagesBuffer = [];
    }

    public getAllMessagesForToday(): Message[] {
        const currentDate = new Date();
        const fileName = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}.json`;
        const filePath = path.join(this.messagesDirPath, fileName);

        // Read messages from the file
        try {
            const fileData = fs.readFileSync(filePath, 'utf-8');
            const messages: Message[] = fileData.split('\n').map(line => {
                try {
                    return JSON.parse(line);
                } catch (error) {
                    return null; // Handle malformed JSON lines gracefully
                }
            }).filter(msg => msg !== null);
            return messages;
        } catch (error) {
            console.error('Error reading messages file:', error);
            return [];
        }
    }
}