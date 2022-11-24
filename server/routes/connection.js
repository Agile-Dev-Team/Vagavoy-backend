import express from 'express';
import passport from 'passport';

import connectionController from '../controllers/connectionController.js';
var router = express.Router();

router.get("/", passport.authenticate('jwt', {session: false}), connectionController.connections);

export default router;