import express from 'express';
import passport from 'passport';

import newsfeedController from '../controllers/newsfeedController.js';
var router = express.Router();

router.get("/", passport.authenticate('jwt', {session: false}), newsfeedController.getNewsFeed);

export default router;