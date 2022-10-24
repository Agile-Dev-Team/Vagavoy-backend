import mongoose from 'mongoose';
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

const Schema = mongoose.Schema;

const userSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  mainInfo: {
    name: {
      type: String,
      required: true,
      min:6,
      max: 255
    },
    location: {
      type: String
    },
    lastTripLocation: {
      type: String
    },
    nextSpotOnBucketList: {
      type: String
    },
  },
  email: {
    type: String,
    required: true,
    max: 255,
    min: 6
  },
  password: {
    type: String,
    required: true,
    max: 1024,
    min: 6
  },
  date: {
    type: Date,
    default: Date.now()
  },
  verified: {
    type: Boolean,
    required: true,
    default: false
  },
  profileImage: {
    type: String
  },
  bannerImage: {
    type: String
  },
  about: {
    type: String
  },
  travels: [{
    type: Schema.Types.ObjectId,
    ref: 'Travel'
  }],
  connectedUsers: [{
    type: Schema.Types.ObjectId
  }],
  requestedUsers: [{
    type: Schema.Types.ObjectId
  }]
});

userSchema.methods.generateVerificationToken = function () {
  const user = this;
  const verificationToken = jwt.sign(
      { ID: user._id },
      process.env.USER_VERIFICATION_TOKEN_SECRET,
      { expiresIn: "10m" }
  );
  return verificationToken;
};

userSchema.methods.generateResetPasswordToken = function () {
  crypto.randomBytes(20, (err, buf) => {
    if (err) {
      // Prints error
      console.log(err);
      return;
    }
    
    // Prints random bytes of generated data
    return buf.toString('hex');
  });
};

export default mongoose.model("User", userSchema);