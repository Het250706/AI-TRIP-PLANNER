import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const testEmail = async () => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Trip Planner <onboarding@resend.dev>',
            to: 'phet25706@gmail.com', // Sending to the owner email instead of a new one to test
            subject: 'Test Email',
            html: '<p>Test OTP: 123456</p>'
        });

        if (error) {
            console.error("Test Email Error:", error);
        } else {
            console.log("Test Email Success:", data);
        }
    } catch (err) {
        console.error("Catch Error:", err);
    }
};

testEmail();
