// import nodemailer from 'nodemailer';

// export const  transport = nodemailer.createTransport({
//     service: 'gmail',
//     auth : {
//         user:process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
//         pass:process.env.NODE_CODE_SENDING_EMAIL_PASSWORD,
//     },
// });

import nodemailer from 'nodemailer';

// Create a transport configuration with proper error handling
export const transport = nodemailer.createTransport({
    service: 'gmail', // or your email service
    host: 'smtp.gmail.com',
    port: 587, // Try this port instead of 465
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD // Use app password if using Gmail
    },
    tls: {
        rejectUnauthorized: false // Only use during development/debugging
    }
});

// Test the connection on server startup
transport.verify((error, success) => {
    if (error) {
        console.error('SMTP connection error:', error);
    } else {
        console.log('SMTP server is ready to send messages');
    }
});


