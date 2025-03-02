const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link to user
    message: { type: String, required: true }, // Notification text
    status: { type: String, enum: ["unread", "read"], default: "unread" }, // Track read/unread
    createdAt: { type: Date, default: Date.now } // Timestamp
});

module.exports = mongoose.model("Notification", notificationSchema);
