import userModel from "../../../models/user";
import status from "../../../enums/status";
import userType from "../../../enums/userType";

const userServices = {




  createUser: async (insertObj) => {
    return await userModel.create(insertObj);
  },

  findUser: async (query) => {
    return await userModel.findOne(query)
  },


  findUserAll: async (query) => {
    return await userModel.find(query);
  },




};

module.exports = {
  userServices
};