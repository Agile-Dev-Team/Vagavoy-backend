import express from 'express';
import passport from 'passport';

import travelController from '../controllers/travelController.js';
import galleryController from '../controllers/galleryController.js';
import userMiddleware from '../middlewares/userMiddleware.js';
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

/**
 * Gallery CRUD
 */


export default router;