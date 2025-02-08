import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    sellerAddress: { type: String, required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    price: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("Transaction", TransactionSchema);
