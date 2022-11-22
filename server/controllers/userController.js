import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "../models/user.js";
import Travel from "../models/travel.js";
import travel from "../models/travel.js";
import user from "../models/user.js";

const create = async (req, res) => {
  // Validate request
  if (!req.body) {
    return res.status(400).json({
      message: "Please fill all required field",
    });
  }
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    } else {
      const newUser = new User(req.body);
      newUser._id = new mongoose.Types.ObjectId();
      //   const newUser = new User({
      //     _id: new mongoose.Types.ObjectId,
      //     name: req.body.name,
      //     email: req.body.email,
      //     password: req.body.password,
      //     role: req.body.role,
      //     isHost: req.body.isHost
      //   });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
};

const findAll = (req, res) => {
  User.find()
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(500).json({
        message: "Something went wrong while getting list of users.",
      });
    });
};

const findOne = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: "User not found with id " + req.params.id,
        });
      }
      res.json(user);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).json({
          message: "User not found with id " + req.params.id,
        });
      }
      return res.status(500).json({
        message: "Error getting user with id " + req.params.id,
      });
    });
};

const update = async (req, res) => {
  // Validate Request
  if (!req.body) {
    return res.status(400).send({
      message: "Please fill all required field",
    });
  }
  if (req.body.email) {
    const userEmail = await User.find({ email: req.body.email });
    if (userEmail.length)
      return res.json({ message: "User already exists with same email" });
  }
  //Object.assign(req.user, req.body)
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      message: "user not found with id " + req.params.id,
    });
  } else {
    Object.assign(user, req.body);
    if (req.body.password) {
      const hashedpassword = req.body.password;
      bcrypt.genSalt(10, async (err, salt) => {
        bcrypt.hash(hashedpassword, salt, async (err, hash) => {
          if (err) throw err;
          else {
            user.password = hash;
            try {
              await user.save();
              return res.json(user);
            } catch (e) {
              console.log(e);
              return res.status(500).send({
                message: "Can not update",
              });
            }
          }
        });
      });
    } else {
      try {
        await user.save();
        return res.json(user);
      } catch (e) {
        console.log(e);
        return res.status(500).send({
          message: "Can not update",
        });
      }
    }
  }

  // user.save()
  // .then((updatedUser) => {
  //     res.json(updatedUser)
  // })
  // .catch(err => {
  //     return res.json({message: "Cannot Update"})
  // })
};

const deleteOne = (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: "user not found with id " + req.params.id,
        });
      }
      res.json({ message: "user deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).json({
          message: "user not found with id " + req.params.id,
        });
      }
      return res.status(500).json({
        message: "Could not delete user with id " + req.params.id,
      });
    });
};

function uploadAvatar(req, res, next) {
  const userId = req.body.userId;

  User.findById(userId)
    .then((user) => {
      user.profileImage = req.body.profileImage;
      user
        .save()
        .then((updatedUser) => {
          res.json(updatedUser);
        })
        .catch(next);
    })
    .catch(next);
}

function getUserAvatar(req, res, next) {
  User.findById(req.params.userId)
    .then((user) => {
      res.json(user.profileImage);
    })
    .catch(next);
}

function removeUserAvatar(req, res, next) {
  User.findById(req.params.userId)
    .then((user) => {
      user.profileImage = null;

      user
        .save()
        .then(() => {
          res.json({ message: "Avatar for user have been removed" });
        })
        .catch(next);
    })
    .catch(next);
}

// BannerImage Manipulation
function uploadBannerImage(req, res, next) {
  const userId = req.body.userId;

  User.findById(userId)
    .then((user) => {
      user.bannerImage = req.body.bannerImage;
      user
        .save()
        .then((updatedUser) => {
          res.json(updatedUser);
        })
        .catch(next);
    })
    .catch(next);
}

function getUserBannerImage(req, res, next) {
  User.findById(req.params.userId)
    .then((user) => {
      res.json(user.bannerImage);
    })
    .catch(next);
}

function removeBannerImage(req, res, next) {
  User.findById(req.params.userId)
    .then((user) => {
      user.bannerImage = null;
      user
        .save()
        .then(() => {
          res.json({ message: "Banner Image for user have been removed" });
        })
        .catch(next);
    })
    .catch(next);
}

function findTravelByUserId(req, res, next) {
  Travel.find({ userId: req.params.userId })
    .then((travels) => {
      travels.forEach(function (travel) {
        travel.tripLogId = travel._id;
      })
      res.json(travels);
    })
    .catch(next);
}

const searchUsersByTrip = async (req, res, next) => {
  try {
    console.log(req.body.searchKey.substring(0, 2))
    // const travels = await Travel.find({tripLocation: { $regex: req.body.searchKey.substring(0, 2)}});
    // console.log("Searched Travels", travels)
    // let users = await Promise.all(travels.map(async travel => {
    //   const user = await User.findById(travel.userId);
    //   // if(!users.length) {
    //   //   // users.push(user);
    //   //   return user;
    //   // }
    //   // else if(!users.some(el => el._id === user._id))
    //   // // users.push(user);
    //   return user
    // }))
    // const key = { $regex: req.body.searchKey.substring(0,2), $options: "i" };
    const key = { $regex: req.body.searchKey, $options: "i" };
    let users = await User.find({
      $or: [
        {
          'mainInfo.name': key
        },
        {
          'mainInfo.location': key
        }, 
        {
          'mainInfo.lastTripLocation': key 
        }, 
        { 
          'mainInfo.nextSpotOnBucketList': key 
        }
      ] 
    });
    console.log(users)
    users = users.filter((value, index, self) =>
      self.findIndex((t) => (
        t._id === value._id
      )) === index
    )
    // console.log("Result", users)
    res.json(users);
  } catch (err) {
    return res.json(err);
  }
}

const connectRequest = async (req, res, next) => {
  User.findById(req.body.userId)
    .then((user) => {
      console.log(req.user.id);
      console.log(user.requestedUsers);
      if(user.requestedUsers.indexOf(req.user.id) === -1 && user.connectedUsers.indexOf(req.user.id) === -1) {
        user.requestedUsers.push(req.user.id);
        user.save()
          .then(async newUser => res.json(await getConnections(req.user)))
          .catch(err => console.log(err))
      } else res.status(400).json("This user was already requested to connect");
    })
    .catch(next);
}

const connectAccept = async (req, res, next) => {
  console.log("here is accept section")
  User.findById(req.user.id)
    .then((user) => {
      console.log(user.requestedUsers);
      const index = user.requestedUsers.indexOf(req.body.userId);
      if (index > -1) {
        user.requestedUsers.splice(index, 1);
      }
      console.log("connectedUsers", user.connectedUsers, req.body.userId)
      user.connectedUsers.push(req.body.userId);
      User.findById(req.body.userId)
        .then((connectedUser) => {
          console.log("error area", connectedUser, req.user.id)
          connectedUser.connectedUsers.push(req.user.id);
          user.save()
            .then(async newUser => {
              connectedUser.save();
              res.json(await getConnections(newUser));
            })
            .catch(next);
        })
        .catch(next);
    })
    .catch(next);
}

const connectReject = async (req, res, next) => {
  User.findById(req.user.id)
    .then((user) => {
      console.log(user.requestedUsers);
      const index = user.requestedUsers.indexOf(req.body.userId);
      if (index > -1)
        user.requestedUsers.splice(index, 1);
      user.save()
        .then(async newUser => res.json(await getConnections(newUser)))
        .catch(next);
    })
    .catch(next);
}

const connectRemove = async (req, res, next) => {
  User.findById(req.user.id)
    .then((user) => {
      console.log(user.connectedUsers);
      const index = user.connectedUsers.indexOf(req.body.userId);
      if (index > -1)
        user.connectedUsers.splice(index, 1);
      User.findById(req.body.userId)
        .then((removedUser) => {
          const removedIndex = removedUser.connectedUsers.indexOf(req.user.id);
          removedUser.connectedUsers.splice(removedIndex, 1);
          user.save()
            .then(async newUser => {
              removedUser.save();
              res.json(await getConnections(newUser));
            })
            .catch(next);
        })
        .catch(next);
    })
    .catch(next);
}

const getConnections = async (currentUser) => {
  const connectedUserIds = currentUser.connectedUsers || [];
  const requestedUserIds = currentUser.requestedUsers || [];
  let connectedUsers = [];
  let requestedUsers = [];
  connectedUserIds.forEach(userId => connectedUsers.push(User.findById(userId).select('mainInfo profileImage')));
  await Promise.all(connectedUsers)
  .then(v => {
    connectedUsers = v;
  })
  .catch(err => {
    console.log("No connected users");
  });

  requestedUserIds.forEach(userId => requestedUsers.push(User.findById(userId).select('mainInfo profileImage')));
  await Promise.all(requestedUsers)
  .then(v => {
    requestedUsers = v;
  })
  .catch(err => {
    console.log("No connected users");
  });

  let recommendedUsers = await User.find({'mainInfo.location' : currentUser.mainInfo.location}).select('mainInfo profileImage bannerImage');
  recommendedUsers = recommendedUsers.filter((user, index, itself) => {user._id != currentUser.id && !requestedUserIds.includes(user._id) && !connectedUserIds.includes(user._id)});
  return {connectedUsers, requestedUsers, recommendedUsers}
}

const connections = async (req, res, next) => {
  console.log("connection", req.user.id)
  const newUser = await User.findById(req.user.id);
  try {
    const result = await getConnections(newUser);
    res.json(result);
  }
  catch(err) {res.status(404).send(err);}

}

const userController = {
  create,
  findAll,
  findOne,
  update,
  deleteOne,
  uploadAvatar,
  removeUserAvatar,
  getUserAvatar,
  uploadBannerImage,
  removeBannerImage,
  getUserBannerImage,
  findTravelByUserId,
  searchUsersByTrip,
  connectRequest,
  connectAccept,
  connectReject,
  connectRemove,
  connections
};

export default userController;
