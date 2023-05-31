
const mongoose = require("mongoose")

const userSigninSchema = mongoose.Schema(
    {
        id: mongoose.Schema.Types.ObjectId,
        email: {
            type: String,
            required: true
        },

        password: {
            type: String,
            required: true
        }
    }


)

const userSignin = mongoose.model('UserSignin', userSigninSchema);
module.exports = userSignin;