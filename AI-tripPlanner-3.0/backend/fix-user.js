import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import userModel from './models/user-model.js';
import dotenv from 'dotenv';

dotenv.config();

const fixUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tripplanner');
        console.log("Connected to MongoDB");

        const email = "phet6433@gmail.com"; // From the user's screenshot
        const password = "12345678";

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await userModel.findOne({ email });

        if (user) {
            user.password = hashedPassword;
            await user.save();
            console.log(`Updated password for ${email} to ${password}`);
        } else {
            await userModel.create({
                fullname: "Test User",
                email: email,
                password: hashedPassword
            });
            console.log(`Created new user ${email} with password ${password}`);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fixUser();
