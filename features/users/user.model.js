const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const { Schema } = mongoose;

const UserSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' }
}, {
    timestamps: true
})
UserSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
    bcryptjs
        .genSalt(10)
        .then(salt => {
            return bcryptjs.hash(user.password, salt)
        })
        .then(hash => {
            user.password = hash;
            return next();
        })
        .catch(error => {
            throw error
        });
})
const User = mongoose.model('User', UserSchema, 'users');

module.exports = {
    User, UserSchema
}