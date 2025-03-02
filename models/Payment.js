const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    bookingId: { type: String, required: true },
    amount: { type: Number, required: true },
    transactionId: { type: String, unique: true, default: function () { return new mongoose.Types.ObjectId().toString(); } },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" }
}, { timestamps: true });

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
