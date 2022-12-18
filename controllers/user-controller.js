// External Import
const bcrypt = require("bcrypt");

// Internal Import
const RegisterUser = require("../models/RegisterUser");
const UserDetails = require("../models/UserDetails");
const UserEmergency = require("../models/UserEmergency");
const customErrorMsg = require("../utilities/custom-error-msg");
const sendEmail = require("../utilities/send-mail");
const JwtService = require("../utilities/jwt-service");

// User Register
const registerUser = async (req, res, next) => {
    try {
        const { email, password, deviceId } = req.body;

        // Generate six digit OTP
        const varifyOtp = Math.floor(100000 + Math.random() * 900000);

        // OTP expire time
        const otpExpire = Date.now() + 2 * 60 * 1000;

        const message = `Hello,\n\nPlease use the verification code below on the Apply App \n\nYour OTP: ${varifyOtp}\n\nIf you didn't request this, you can ingore this email or let us know.\n\nThanks!\nApply App`;

        // Hashing password
        const hashPassword = await bcrypt.hash(password, 12);

        const registerUserData = new RegisterUser({
            email: email,
            password: hashPassword,
            deviceId: deviceId,
            otp: varifyOtp,
            otpExpire: otpExpire,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        // Save data in database
        await registerUserData.save();

        // Send Mail
        await sendEmail({
            email: email,
            subject: "Email Verification",
            message,
        });

        res.status(200).json({
            success: true,
            registerUserData,
        });
    } catch (err) {
        next(err);
    }
};
// Resend OTP
const resendVarifiactionOtp = async (req, res, next) => {
    try {
        const user = await RegisterUser.findOne({ _id: req.params.userId });
        if (!user) return next(customErrorMsg.notAccept("User not found!"));

        if (user.isVerified)
            return next(
                customErrorMsg.notAccept("This email already verified")
            );

        // Generate six digit OTP
        const varifyOtp = Math.floor(100000 + Math.random() * 900000);

        // OTP expire time
        const otpExpire = Date.now() + 2 * 60 * 1000;

        const message = `Hello,\n\nPlease use the verification code below on the Arengu website: ${
            req.protocol
        }://${req.get(
            "host"
        )}/\n\nYour OTP: ${varifyOtp}\n\nIf you didn't request this, you can ingore this email or let us know.\n\nThanks!\nApply App`;

        user.otp = varifyOtp;
        user.otpExpire = otpExpire;
        await user.save();

        await sendEmail({
            email: user.email,
            subject: "Email Verification",
            message,
        });
        res.status(200).json({
            success: true,
            msg: "Resend OTP successfully",
        });
    } catch (err) {
        next(err);
    }
};
// Email Verification
const mailVerifiacation = async (req, res, next) => {
    try {
        const registerUser = await RegisterUser.findOne({
            $and: [{ _id: req.params.userId }, { otp: req.body.otp }],
        });

        if (!registerUser)
            return next(customErrorMsg.notFound("Your otp is worng!"));

        if (registerUser.otp !== req.body.otp)
            return next(customErrorMsg.notAccept("Your otp is worng!"));

        if (registerUser.otpExpire < Date.now())
            return next(customErrorMsg.notAccept("Expired OTP!"));

        registerUser.isVerified = true;
        registerUser.otp = undefined;
        registerUser.otpExpire = undefined;

        await registerUser.save();

        res.status(200).json({
            success: true,
            msg: "Email verification successfully",
        });
    } catch (err) {
        next(err);
    }
};
// User Details
const userDetails = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await RegisterUser.findOne({ _id: userId });
        if (!user)
            return next(customErrorMsg.notAccept("You are not registerd"));
        const userDetails = new UserDetails({
            userId: user._id,
            email: user.email,
            password: user.password,
            deviceId: user.deviceId,
            ...req.body,
        });
        await userDetails.save();
        res.status(200).json({
            success: true,
            msg: "User details submit successfully",
            userDetails,
        });
    } catch (err) {
        next(err);
    }
};

// User Emergency contact
const userEmergency = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await RegisterUser.findOne({ _id: userId });
        if (!user) return next(customErrorMsg.notAccept("User not found!"));

        const newData = new UserEmergency({
            userId: userId,
            ...req.body,
        });

        await newData.save();

        res.status(200).json({
            success: true,
            msg: "Emergency contact submit successfully",
            newData,
        });
    } catch (err) {
        next(err);
    }
};

// User Login
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await RegisterUser.findOne({
            $and: [{ _id: req.params.userId }, { email: email }],
        });

        // Check email
        if (!user)
            return next(customErrorMsg.notAccept("Worng email or password"));

        // Match Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return next(customErrorMsg.notAccept("Worng email or password"));

        const payload = {
            id: user._id,
            email: user.email,
        };
        const accessToken = JwtService.sign(payload);
        res.status(200).json({
            success: true,
            token: accessToken,
        });
    } catch (err) {
        next(err);
    }
};

// User Forget Password OTP Sender
const forgetPassowrdOtpSender = async (req, res, next) => {
    try {
        const user = await RegisterUser.findOne({ email: req.body.email });

        if (!user) return next(customErrorMsg.notFound("Invalid your email"));
        // Generate six digit OTP
        const varifyOtp = Math.floor(100000 + Math.random() * 900000);

        // OTP expire time
        const otpExpire = Date.now() + 2 * 60 * 1000;

        const message = `Hello,\n\nPlease use the verification code below on the Arengu website: ${
            req.protocol
        }://${req.get(
            "host"
        )}/\n\nYour OTP: ${varifyOtp}\n\nIf you didn't request this, you can ingore this email or let us know.\n\nThanks!\nApply App`;

        user.forgetOtp = varifyOtp;
        user.forgetOtpExpire = otpExpire;
        await user.save();

        await sendEmail({
            email: user.email,
            subject: "Forget Password Verification",
            message,
        });

        res.status(200).json({
            success: true,
            msg: "Forget Password OTP Send successfully",
            userId: user._id,
        });
    } catch (err) {
        next(err);
    }
};

// User Forget Password
const forgetPassword = async (req, res, next) => {
    try {
        const user = await RegisterUser.findOne({
            $and: [{ _id: req.params.userId }, { forgetOtp: req.body.otp }],
        });

        if (!user) return next(customErrorMsg.notAccept("User not found!"));

        if (user.otpExpire !== req.body.otp)
            return next(customErrorMsg.notAccept("Your otp is worng"));
    } catch (err) {
        next(err);
    }
};

// User Update Details
const userUpdateDetails = async (req, res, next) => {
    try {
        const {
            title,
            firstName,
            middleName,
            surName,
            phone,
            passportId,
            nationalId,
            location,
        } = req.body;

        const user = await UserDetails.findOneAndUpdate({
            userId: req.params.userId,
        });
        if (!user) return next(customErrorMsg.notFound("User not found!"));

        user.title = title ?? user.title;
        user.firstName = firstName ?? user.firstName;
        user.middleName = middleName ?? user.middleName;
        user.surName = surName ?? user.surName;
        user.phone = phone ?? user.phone;
        user.passportId = passportId ?? user.passportId;
        user.nationalId = nationalId ?? user.nationalId;
        user.location = location ?? user.location;
        await user.save();
        res.status(200).json({
            success: true,
            user,
        });
    } catch (err) {
        next(err);
    }
};

// User Update Emergency Contact
const updateEmergencyContact = async (req, res, next) => {
    try {
        const { title, firstName, middleName, surName, phone, relation } =
            req.body;
        const user = await UserEmergency.findOneAndUpdate({
            userId: req.params.userId,
        });
        if (!user) return next(customErrorMsg.notFound("User not found!"));

        user.title = title ?? user.title;
        user.firstName = firstName ?? user.firstName;
        user.middleName = middleName ?? user.middleName;
        user.surName = surName ?? user.surName;
        user.phone = phone ?? user.phone;
        user.relation = relation ?? user.relation;
        await user.save();
        res.status(200).json({
            success: true,
            user,
        });
    } catch (err) {
        next(err);
    }
};

const testing = (req, res) => {
    res.json(req.body);
};

module.exports = {
    registerUser,
    resendVarifiactionOtp,
    mailVerifiacation,
    userDetails,
    userEmergency,
    loginUser,
    forgetPassowrdOtpSender,
    userUpdateDetails,
    updateEmergencyContact,
    testing,
};
