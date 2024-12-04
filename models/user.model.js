const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    username: String,
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    }
}, {
    timestamps: true, versionKey: false
});

const User = model('user', userSchema);
module.exports = User;