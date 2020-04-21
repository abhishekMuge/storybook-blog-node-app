const mongoose = require('mongoose');
// var timestamps = require('mongoose-timestamp')
const Schema = mongoose.Schema;

const StorySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'public'
    },
    allowComments: {
        type: Boolean,
        default: true
    },
    storyDate : {
        type : Date,
        default: Date.now()
    },
    comments: [{
        commentBody : {
            type: String,
            require: true
        },
        commentDate: {
            type : Date,
            default: Date.now()
        },
        commentUser : {
            type: Schema.ObjectId,
            ref: 'user'
        }
    }],
    user:{
        type: Schema.ObjectId,
        ref: 'user'
    }
});
// UserSchema.plugin(timestamps);
mongoose.model('stories', StorySchema, 'stories');