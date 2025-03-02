const { createNotification } = require('../controllers/notificationController');
const sendEmail = require('../utils/emailService');
const Payment = require('../models/Payment');

const DELAY_THRESHOLD = 30000; // 30 sec
const CANCEL_THRESHOLD = 60000; // 60 sec

const processPayment = async (req, res) => {
    try {
        const { userId, amount, bookingId, email } = req.body;

        let payment = new Payment({ userId, bookingId, amount, status: "pending" });
        await payment.save();

        const startTime = Date.now();
        const processingTime = Math.floor(Math.random() * (70000 - 10000 + 1)) + 10000;
        console.log(`Processing Time: ${processingTime} ms`);

        // Delay Notification (After 30 sec)
        setTimeout(async () => {
            if (Date.now() - startTime >= DELAY_THRESHOLD) {
                const message = "Your payment is taking longer than expected.";
                await createNotification(userId, payment._id, "delay", message);
                await sendEmail(email, "Payment Delay", message);
            }
        }, DELAY_THRESHOLD);

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, processingTime));

        // Auto-cancel if more than 60 sec
        if (Date.now() - startTime >= CANCEL_THRESHOLD) {
            payment.status = "canceled";
            await payment.save();

            const message = "Your payment was canceled due to processing delay.";
            await createNotification(userId, payment._id, "cancellation", message);
            await sendEmail(email, "Payment Canceled", message);

            return res.status(408).json({ message, payment });
        }

        // Success or Failure
        const isSuccess = Math.random() < 0.7;
        payment.status = isSuccess ? "success" : "failed";
        await payment.save();

        return res.status(200).json({
            message: isSuccess ? "Payment successful" : "Payment failed",
            payment
        });

    } catch (error) {
        console.error("Payment Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { processPayment };
