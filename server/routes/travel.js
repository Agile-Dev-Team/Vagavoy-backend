import express from 'express';
import passport from 'passport';

import travelController from '../controllers/travelController.js';
import userMiddleware from '../middlewares/userMiddleware.js';
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

/**
 * Travel CRUD
 */
router.post("/", passport.authenticate('jwt', {session: false}), userMiddleware, travelController.create);

router.get("/", travelController.findAll);

router.get("/:id", travelController.findOne);

router.put("/:id", passport.authenticate('jwt', {session: false}), userMiddleware, travelController.update);

router.delete("/:id", passport.authenticate('jwt', {session: false}), userMiddleware, travelController.deleteOne);

router.route("/:id/gallery")
  .get(travelController.findGalleryByTripId)
  .put(passport.authenticate('jwt', {session: false}), userMiddleware, travelController.updateGalleryByTripId);
  // .delete()

router.route("/:id/recommendations")
  .get(travelController.findRecommendationsByTripId)
  .put(passport.authenticate('jwt', {session: false}), userMiddleware, travelController.updateRecommendationsByTripId);
  
export default router;