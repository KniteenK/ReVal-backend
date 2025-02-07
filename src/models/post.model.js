import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    images: [{
        type: String
    }],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        content: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    shares: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Post = mongoose.model('Post', PostSchema);

export default Post;
