const mongoose = require('mongoose');
// var timestamps = require('mongoose-timestamp')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    googleID: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    avatar: {
        type: String
    }
});
// UserSchema.plugin(timestamps);
mongoose.model('user', UserSchema);