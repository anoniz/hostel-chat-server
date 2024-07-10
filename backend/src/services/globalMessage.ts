// global Set for storing users and messages

import User from '../../../shared/types/user';

export default class UserManager {
    private users: Map<string, User>;

    constructor() {
        this.users = new Map();
    }

    public addUser(user: User): boolean {
        if (this.userExists(user.username)) {
            return false;
        }
        this.users.set(user.username, user);
        return true;
    }

    public userExists(username: string): boolean {
        return this.users.has(username);
    }

    public removeUser(user: User): boolean {
        return this.users.delete(user.username);
    }

    public getUser(username: string): User | undefined {
        return this.users.get(username);
    }
}





