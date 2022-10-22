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

const update = async (req, res, next) => {
  const travel = await Travel.findById(req.params.id)
  Travel.findById(req.params.id)
  .then(travel => {
    Object.assign(travel, req.body);
    travel.save()
    .then((updatedTravel) => {
      res.json(updatedTravel)
    })
    .catch(err => {
      return res.status(500).json({
        message: "travel can't be updated"
      })
    })
  })
  .catch(err => {
    if(err.kind === 'ObjectId') {
      return res.status(404).json({
        message: "travel not found with id " + req.params.id
      });
    }
    return res.status(500).json({
      message: "Error getting travel with id " + req.params.id
    });
  })
}

const findAll = (req, res, next) => {
  Travel.find({user: req.user.id})
  .then((travels) => {
    res.json(travels)
  })
  .catch(next)
}

const findOne = (req, res, next) => {
  Travel.findById(req.params.id)
  .then(travel => {
    if(!travel) {
      return res.status(404).json({
        message: "travel not found with id " + req.params.id
      });
    }
    res.json(travel);
  }).catch(err => {
    if(err.kind === 'ObjectId') {
      return res.status(404).json({
        message: "travel not found with id " + req.params.id
      });
    }
    return res.status(500).json({
      message: "Error getting travel with id " + req.params.id
    });
  });
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
  findOne,
  findAll,
  deleteOne,
}

export default travelController