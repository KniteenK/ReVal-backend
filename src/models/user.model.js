import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String, // URL of profile image
        default: "default-profile.png"
    },
    address: {
        street: String,
        city: String,
        state: String
    },
    accessToken: {
        type: String
    },
    refreshToken: {
        type: String
    },
    walletAddress: {
        type: String, // User’s blockchain wallet address
        unique: true,
        sparse: true
    },
    blockchainTransactions: [{
        txId: {
            type: String // Stores transaction hash from blockchain
        },
        amount: {
            type: Number
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    rating: {
        type: Number,
        default: 0
    },
    itemsListed: [{
        type: Schema.Types.ObjectId,
        ref: "Product"
    }],
    itemsSold: [{
        type: Schema.Types.ObjectId,
        ref: "Product"
    }],
    followers: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    following: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    socialPosts: [{
        postContent: String,
        images: [String],
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]
});

// Encrypt password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate access token
UserSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { _id: this._id, username: this.username, email: this.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

// Generate refresh token
UserSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};

const User = mongoose.model('User', UserSchema);

export default User;
