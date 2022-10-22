import Travel from '../models/travel.js'

const findByTravelId = async (req, res, next) => {
  Travel.findById(req.params.id)
  .then(travel => {
    if(!travel) {
      return res.status(404).json({
        message: "travel not found with id " + req.params.id
      });
    }
    res.json(travel.imageURLs);
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

const updateGallery = async (req, res, next) => {
  
}