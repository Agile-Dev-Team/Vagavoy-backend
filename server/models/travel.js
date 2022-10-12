import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const travelSchema = new Schema({
  _id: Schema.Types.ObjectId,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  flagImageURL: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  description: {
    type: String
  },
  imageURLs: [{
    filename: { type: String },
    url: { type: String }
  }],
  tripRecoms: [{
    title: {
      type: String,
      enum: ['accommodation', 'eating', 'gettingAround', 'activity', 'otherTrip']
    },
    information: { type: String }
  }],
  notification: {
    type: Boolean,
    default: true
  }
})

export default mongoose.model("Travel", travelSchema)