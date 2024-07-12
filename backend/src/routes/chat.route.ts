import { Router } from "express";
import UserController from "../controllers/userManager.controller";
const router =  Router();

// new controller

const userController = new UserController();

router.route('/user')
.post(userController.createUser)
.get(userController.getUser)
.delete(userController.deleteUser);

router.route('/users')
.get(userController.getUsers);

router.route('/message')
.post(userController.sendMessage)
.get(userController.getMessagesForToday);

export default router;

