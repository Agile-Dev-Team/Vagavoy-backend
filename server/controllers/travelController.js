import mongoose from "mongoose"

import Travel from "../models/travel.js"

const create = (req, res, next) => {
  const travel = new Travel(req.body)
  travel.user = req.user.id
  travel.save()
  .then((newTravel) => {
    req.user.travels.push(newTravel)
    req.user.save()
    .then((newUser) => {
      res.json(newTravel)
    })
    .catch(next)
  })
  .catch(next)
}

const update = (req, res, next) => {
  Object.assign(req.travel, req.body)
  req.travel.save()
  .then((updatedTravel) => {
    res.json(updatedTravel)
  })
  .catch(next)
}

const findAll = (req, res, next) => {
  Travel.find({user: req.user.id})
  .then((travels) => {
    res.json(travels)
  })
  .catch(next)
}

const deleteOne = (req, res, next) => {
  Travel.findByIdAndRemove(req.params.id)
  .then(travel => {
    if(!travel) {
      return res.status(404).json({
        message: "travel not found with id " + req.params.id
      });
    }
    res.json({message: "travel deleted successfully!"});
  }).catch(err => {
    if(err.kind === 'ObjectId' || err.name === 'NotFound') {
      return res.status(404).json({
        message: "travel not found with id " + req.params.id
      });
    }
    return res.status(500).json({
      message: "Could not delete travel with id " + req.params.id
    });
  });
}
const travelController = {
  create,
  update,
  findAll,
  deleteOne,
}

export default travelController