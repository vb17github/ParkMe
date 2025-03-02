const Notification = require("../models/Notification");
const { io } = require("../app"); // Import WebSocket instance

// Send Notification (when payment is delayed or canceled)
const sendNotification = async (userId, message) => {
    try {
        // Save in database
        const notification = new Notification({ userId, message });
        await notification.save();

        // Emit real-time notification
        io.emit(`notification:${userId}`, { message, status: "unread" });
    } catch (error) {
        console.error("Error sending notification:", error.message);
    }
};

// Fetch Unread Notifications
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.params.userId });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notifications" });
    }
};

// Mark as Read
const markAsRead = async (req, res) => {
    try {
        await Notification.updateMany({ userId: req.params.userId }, { status: "read" });
        res.json({ message: "Notifications marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Error updating notifications" });
    }
};

module.exports = { sendNotification, getNotifications, markAsRead };
