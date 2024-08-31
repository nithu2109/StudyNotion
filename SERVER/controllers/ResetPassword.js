const User = require('../models/User');
const mailSender = require('../utils/mailsender');
const bcrypt = require('bcrypt');
const crypto = require('crypto');  // Ensure crypto is required

exports.resetPasswordToken = async (req, res) => {
    try {
        const email = req.body.email;

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.json({
                success: false,
                message: "Email is not registered with us",
            });
        }

        const token = crypto.randomUUID();
        const updatedDetails = await User.findOneAndUpdate(
            { email: email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 5 * 60 * 1000,
            },
            { new: true }
        );

        const url = `http://localhost:3000/update-password/${token}`;

        await mailSender(email, "Password Reset Link", `Password Reset Link: ${url}`);

        return res.json({
            success: true,
            message: "Password Reset Link has been sent to your email",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while sending the link",
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword, token } = req.body;

        if (password !== confirmPassword) {
            return res.json({
                success: false,
                message: "Password and Confirm Password do not match",
            });
        }

        const userDetails = await User.findOne({ token: token });
        if (!userDetails) {
            return res.json({
                success: false,
                message: "Invalid Token",
            });
        }

        if (userDetails.resetPasswordExpires < Date.now()) {
            return res.json({
                success: false,
                message: "Password Reset Link has expired",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.findByIdAndUpdate(userDetails._id, { password: hashedPassword, token: null }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Password has been reset successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while resetting the password",
        });
    }
};
