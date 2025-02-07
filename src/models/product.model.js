import { Schema } from "mongoose";

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    mainCategory: {
        type: String,
        required: true
    },
    subCategory: {
        type: String,
        required: true
    },
    discountPrice: {
        type: Number,
        required: true
    },
    actualPrice: {
        type: Number,
        required: true
    },
    images: {
        type: [String],
        required: true
    },
    bills: {
        type: [String],
    },
    rating: {
        type: Number,
        required: true
    },
    noOfRatings: {
        type: Number,
        required: true
    },
    currentOwner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    previousOwners: [{
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    transactionHistory: [{
        buyerId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        sellerId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        price: {
            type: Number
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        blockchainTxId: {
            type: String // Store blockchain transaction ID
        }
    }],
    blockchainTxId: {
        type: String // Latest transaction ID for blockchain verification
    },
    conditionUpdates: [{
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        newCondition: {
            type: String // e.g., "Like New", "Used - Good"
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]
});

export default ProductSchema;
