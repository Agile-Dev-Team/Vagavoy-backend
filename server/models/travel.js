import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const travelSchema = new Schema({
  _id: Schema.Types.ObjectId,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  tripCountryCode: {
    type: String,
    required: true
  },
  tripLocation: {
    type: String,
    required: true
  },
  tripStartDate: {
    type: Date
  },
  tripEndDate: {
    type: Date
  },
  tripDescription: {
    type: String
  },
  tripGallery: [{
    backgroundInfo: { type: String },
    src: { type: String }
  }],
  tripRecommendations: [{
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