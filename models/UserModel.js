const mongoose = require("mongoose")
const valid = require("validator")
const jwt = require("jsonwebtoken")
const config = require("config")
const { type } = require("express/lib/response")

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        pattern: "^[A-Z][a-z]*$",
        minLength: 3,
        maxLength: 50
    },
    lname: {
        type: String,
        required: true,
        pattern: "^[A-Z][a-z]*$",
        minLength: 3,
        maxLength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (val) => {
                return valid.isEmail(val)
            },
            message: "Not valid email"
        }

    },
    password: {
        type: String,
        required: true,
        minLength: 3,
    },
    isAdmin:{
        type:Boolean
    }

})

userSchema.method("genAuthToken", function () {
    const token = jwt.sign({
        userId: this._id,
        adminRole:this.isAdmin
    },
        config.get("server.jwtsec"))
    return token
})

const User = mongoose.model("users", userSchema)
module.exports = User