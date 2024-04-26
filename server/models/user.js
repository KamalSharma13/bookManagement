import Mongoose, { Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";
import userType from "../enums/userType";
import status from "../enums/status";
import bcrypt from "bcryptjs";

var userModel = new Schema(
  {
    email: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    userName: {
      type: String,
    },
    password: {
      type: String,
    },
    otp: {
      type: String,
    },
    withdrawOtp: {
      type: String,
    },
    otpVerified: {
      type: Boolean,
      default: false,
    },
    userType: {
      type: String,
      enum: [userType.ADMIN, userType.SUBADMIN, userType.USER],
      default: userType.USER,
    },
    status: {
      type: String,
      enum: [status.ACTIVE, status.BLOCK, status.DELETE],
      default: status.ACTIVE,
    },
    address: {
      type: String,
    },
    otpExpireTime: {
      type: Number,
    },
  },


  { timestamps: true }
);

userModel.index({ location: "2dsphere" });
userModel.plugin(mongooseAggregatePaginate);
userModel.plugin(mongoosePaginate);
module.exports = Mongoose.model("user", userModel);

(async () => {
  let result = await Mongoose.model("user", userModel).find({
    userType: userType.ADMIN,
  });

  if (result.length != 0 && result.userType != "ADMIN") {
    console.log("Default Admin updated.");
  } else {
    let obj = {
      userType: userType.ADMIN,
      firstName: "admin",
      lastName: "admin",
      userName: "Admin123",
      countryCode: "+91",
      mobileNumber: "123456789",
      email: "ksharma@mailinator.com",
      password: bcrypt.hashSync("Kamal@1"),
      address: "Delhi, India",
      otpVerified: true,
    };
    var defaultResult = await Mongoose.model("user", userModel).create(obj);
  }

  let userResult = await Mongoose.model("user", userModel).find({
    userType: userType.USER,
    email:"kamal@xyz.com"
  });

  if (userResult.length != 0 && userResult.userType != "USER") {
    console.log("Default USER updated.");
  } else {
    let obj = {
      userType: userType.USER,
      firstName: "user",
      lastName: "user",
      userName: "User123",
      countryCode: "+91",
      mobileNumber: "123456789",
      email: "kamal@xyz.com",
      password: bcrypt.hashSync("Kamal@1"),
      address: "Delhi, India",
      otpVerified: true,
    };
    var defaultResult1 = await Mongoose.model("user", userModel).create(obj);
  }

  if (defaultResult && defaultResult1) {
    console.log("DEFAULT DATA Created.", defaultResult);
  }
}).call();
