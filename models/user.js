let mongoose = require("mongoose")
    passportLocalMongoose = require("passport-local-mongoose"),
    UserSchema = new mongoose.Schema({
        username: String,
        password: String,
        isAdmin: {
            type: Boolean,
            default: false
        }
    });

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);