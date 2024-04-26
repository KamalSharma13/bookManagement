import config from "config";
const fs = require("fs");
import jwt from "jsonwebtoken";

module.exports = {
    getOTP() {
        var otp = Math.floor(100000 + Math.random() * 900000);
        return otp;
    },
    generateTempPassword() {
        return Math.random().toString(36).slice(2, 10);
    },

    getToken: async (payload) => {
        var token = await jwt.sign(payload, config.get("jwtsecret"), {
            expiresIn: "24h",
        });
        return token;
    },

  
}