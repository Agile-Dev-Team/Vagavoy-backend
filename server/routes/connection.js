import express from 'express';
import passport from 'passport';

import userController from '../controllers/userController.js';
import userMiddleware from '../middlewares/userMiddleware.js';
var router = express.Router();

router.get("/", passport.authenticate('jwt', {session: false}), userController.connections);

export default router;