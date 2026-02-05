const Notification = require('../models/Notification');

const createNotification = async (userId, message, type, link) => {
    try {
        await Notification.create({
            user: userId,
            message,
            type,
            link,
        });
        // In a real app, you would also trigger an email here using nodemailer
        console.log(`Notification created for user ${userId}: ${message}`);
    } catch (error) {
        console.error('Error creating notification:', error);
    }
};

module.exports = createNotification;
