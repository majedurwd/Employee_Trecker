// External Import
const bcrypt = require("bcrypt");

// Internal Import
const RegisterUser = require("../models/RegisterUser");
const UserProfile = require("../models/UserProfile")
const UserEmergencyContact = require("../models/UserEmergencyContact")
const Location = require("../models/Location");
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

        // Send Mail
        await sendEmail({
            email: email,
            subject: "Email Verification",
            message,
        });

        // Save data in database
        await registerUserData.save();

        const registerData = {
            userId: registerUserData._id,
        };

        res.status(200).json({
            success: true,
            registerData,
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
// User Profile
const userProfile = async (req, res, next) => {
    try {
        const {
            title,
            firstName,
            middleName,
            surName,
            phone,
            passportId,
            nationalId,
            address,
        } = req.body;
        const registerUser = await RegisterUser.findOne({_id: req.params.userId});
        if (!registerUser)
            return next(customErrorMsg.notAccept("You are not registerd"));
        const userProfile = await UserProfile.findOne({ userId: req.params.userId })
        if (userProfile)
            return next(customErrorMsg.notAccept("User Details Alredy exist Please update"))
        const newUserProfile = new UserProfile({
            userId: registerUser._id,
            title: title,
            firstName: firstName,
            middleName: middleName,
            surName: surName,
            phone: phone,
            passportId: passportId,
            nationalId: nationalId,
            address: address,
            createAt: Date.now(),
            updateAt: Date.now()
        });
        await newUserProfile.save();
        res.status(200).json({
            success: true,
            msg: "User details submit successfully",
            newUserProfile,
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
        if (!user) return next(customErrorMsg.notAccept("You are not registerd!"));

        const existEmergencyData = await UserEmergencyContact.findOne({ userId: userId })
        if (existEmergencyData)
            return next(customErrorMsg.notAccept("Emergency data already exist, Please update!"))

        const emergencyData = new UserEmergencyContact({
            userId: userId,
            ...req.body,
            createAt: Date.now(),
            updateAt: Date.now()
            
        });

        await emergencyData.save();

        res.status(200).json({
            success: true,
            msg: "Emergency contact submit successfully",
            emergencyData,
        });
    } catch (err) {
        next(err);
    }
};

// User Login
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await RegisterUser.findOne({ email: email });

        // Check email
        if (!user)
            return next(customErrorMsg.notAccept("Worng email or password"));

        // Match Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return next(customErrorMsg.notAccept("Worng email or password"));
        if (user.isVerified === false)
            return next(customErrorMsg.notAccept("Please verify your email!"));

        const payload = {
            id: user._id,
            email: user.email,
        };
        const accessToken = JwtService.sign(payload);
        const userProfile = await UserProfile.findOne({ userId: user._id })
        const userEmergency = await UserEmergencyContact.findOne({
            userId: user._id,
        });

        const location = await Location.findOne({ userId: user._id });

        res.status(200).json({
            success: true,
            token: accessToken,
            userId: user._id,
            email: user.email,
            devaiceId: user.deviceId,
            location: location ?? null,
            active: user.active,
            userDetails: userProfile ?? null,
            userEmergency: userEmergency ?? null,
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

        await sendEmail({
            email: user.email,
            subject: "Forget Password Verification",
            message,
        });
        await user.save();

        res.status(200).json({
            success: true,
            msg: "Forget Password OTP Send successfully",
            userId: user._id,
        });
    } catch (err) {
        next(err);
    }
};

// User Forget Password OTP Checker
const forgetPasswordOtpChecker = async (req, res, next) => {
    try {
        const user = await RegisterUser.findOne({
            $and: [{ _id: req.params.userId }, { forgetOtp: req.body.otp }],
        });

        if (!user) return next(customErrorMsg.notAccept("User not found!"));

        if (user.forgetOtp !== req.body.otp)
            return next(customErrorMsg.notAccept("Your otp is worng"));

        if (user.forgetOtpExpire < Date.now())
            return next(customErrorMsg.notAccept("Your OTP is expire!"));

        user.forgetOtp = undefined;
        user.forgetOtpExpire = undefined;
        user.forgetVerify = true;
        await user.save();
        res.status(200).json({
            success: true,
            msg: "OTP verify successfully",
            userId: user._id,
        });
    } catch (err) {
        next(err);
    }
};

const changePassword = async (req, res, next) => {
    try {
        const user = await RegisterUser.findOne({ _id: req.params.userId });
        if (!user) return next(customErrorMsg.notFound("User not found"));
        if (user.forgetVerify === false)
            return next(customErrorMsg.notAccept("OTP not verified"));

        const hashPassword = await bcrypt.hash(req.body.password, 12);
        user.password = hashPassword;
        await user.save();

        const userProfile = await UserProfile.findOne({ userId: req.params.userId })
        if (!userProfile)
            return next(customErrorMsg.notFound("User details not found!"));
        userProfile.password = hashPassword;
        await userProfile.save();

        res.status(200).json({
            success: true,
            msg: "Password change successfuly",
        });
    } catch (err) {
        next(err);
    }
};

/**
 * User Update Details With
 * @method PATCH
 */
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
            address,
        } = req.body;

        const userData = await UserProfile.findOne({
            userId: req.params.userId
        })
        if (!userData) return next(customErrorMsg.notFound("User not found!"));

        userData.title = title ?? userData.title;
        userData.firstName = firstName ?? userData.firstName;
        userData.middleName = middleName ?? userData.middleName;
        userData.surName = surName ?? userData.surName;
        userData.phone = phone ?? userData.phone;
        userData.passportId = passportId ?? userData.passportId;
        userData.nationalId = nationalId ?? userData.nationalId;
        userData.address = address ?? userData.address;
        userData.updateAt = Date.now()
        await userData.save();
        res.status(200).json({
            success: true,
            msg: "User data update successfully",
            userData,
        });
    } catch (err) {
        next(err);
    }
};

// User Update Emergency Contact With PATCH
const updateEmergencyContact = async (req, res, next) => {
    try {
        const { title, firstName, middleName, surName, phone, relation } =
            req.body;
        const emergencyData = await UserEmergencyContact.findOne({
            userId: req.params.userId,
        });
        if (!emergencyData)
            return next(customErrorMsg.notFound("User not found!"));

        emergencyData.title = title ?? emergencyData.title;
        emergencyData.firstName = firstName ?? emergencyData.firstName;
        emergencyData.middleName = middleName ?? emergencyData.middleName;
        emergencyData.surName = surName ?? emergencyData.surName;
        emergencyData.phone = phone ?? emergencyData.phone;
        emergencyData.relation = relation ?? emergencyData.relation;
        emergencyData.updateAt = Date.now()
        await emergencyData.save();
        res.status(200).json({
            success: true,
            msg: "Emergency data update successfully",
            emergencyData,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * User Update Details
 * @method PUT
 */
const userUpdateDetailsByPut = async (req, res, next) => {
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
        const user = await RegisterUser.findById(req.params.userId);
        if (!user)
            return next(
                customErrorMsg.notFound("User not found, Please register")
            )
        const userData = await UserProfile.findById(req.params.userId)
        if (!userData) {
            const newUserData = new UserProfile({
                ...req.body,
            });
            await newUserData.save();
            return res.status(200).json({
                success: true,
                msg: "New User Data Inserted",
                newUserData,
            });
        }
        userData.title = title ?? userData.title;
        userData.firstName = firstName ?? userData.firstName;
        userData.middleName = middleName ?? userData.middleName;
        userData.surName = surName ?? userData.surName;
        userData.phone = phone ?? userData.phone;
        userData.passportId = passportId ?? userData.passportId;
        userData.nationalId = nationalId ?? userData.nationalId;
        userData.location = location ?? userData.location;
        await userData.save();
        res.status(200).json({
            success: true,
            msg: "User data update successfully",
            userData,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * User Update Emergency Contact
 * @method PATCH
 */
const updateEmergencyContactByPut = async (req, res, next) => {
    try {
        const user = await RegisterUser.findById(req.params.userId);
        if (!user)
            return next(
                customErrorMsg.notFound("User not found, Please register")
            );
        const emergencyData = await UserEmergencyContact.findById(req.params.userId);
        if (!emergencyData) {
            const newEmergencyData = new UserEmergencyContact({
                ...req.body,
            });
            await newEmergencyData.save();
            return res.status(200).json({
                success: true,
                msg: "New emergency data inserted",
                newEmergencyData,
            });
        }
        emergencyData.title = title ?? emergencyData.title;
        emergencyData.firstName = firstName ?? emergencyData.firstName;
        emergencyData.middleName = middleName ?? emergencyData.middleName;
        emergencyData.surName = surName ?? emergencyData.surName;
        emergencyData.phone = phone ?? emergencyData.phone;
        emergencyData.relation = relation ?? emergencyData.relation;
        await emergencyData.save();
        res.status(200).json({
            success: true,
            msg: "Emergency data update successfully",
            emergencyData,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Delete user
 * @method Delete
 */
const deleteUser = async (req, res, next) => {
    try {
        const registedUser = await RegisterUser.findByIdAndDelete(
            req.params.userId
        );
        if (!registedUser)
            return next(customErrorMsg.notFound("User not found!"));
        await registedUser.remove();
        const userProfile = await UserProfile.findByIdAndDelete(
            req.params.userId
        );
        if (!userProfile)
            return next(customErrorMsg.notFound("User not found!"));
        await userProfile.remove();
        const emergencyUser = await UserEmergencyContact.findByIdAndDelete(
            req.params.userId
        );
        if (!emergencyUser)
            return next(customErrorMsg.notFound("User not found!"));
        await emergencyUser.remove();
        res.status(200).json({
            success: true,
            msg: "User deleted successfully",
        });
    } catch (err) {
        next(err);
    }
};

const getSingleUser = async (req, res, next) => {
    try {
        const userData = await RegisterUser.findById(req.user.id);
        const userProfile = await UserProfile.findOne({ userId: req.user.id });
        const userEmergency = await UserEmergencyContact.findOne({
            userId: req.user.id,
        });
        const location = await Location.findOne({ userId: req.user.id });

        res.status(200).json({
            success: true,
            token: req.token,
            userId: userData._id,
            location: location ?? null,
            userDetails: userProfile ?? null,
            userEmergency: userEmergency ?? null,
        });
    } catch (err) {
        next(err);
    }
};

/**
 *
 *
 */
const updateGeofence = async (req, res, next) => {
    try {
        const user = await RegisterUser.findOne({ _id: req.user.id });
        user.geofence = req.body.geofence;
        await user.save();
        res.status(200).json({
            success: true,
            msg: "Geofence updated",
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    registerUser,
    resendVarifiactionOtp,
    mailVerifiacation,
    userProfile,
    userEmergency,
    loginUser,
    forgetPassowrdOtpSender,
    forgetPasswordOtpChecker,
    changePassword,
    userUpdateDetails,
    updateEmergencyContact,
    userUpdateDetailsByPut,
    updateEmergencyContactByPut,
    deleteUser,
    getSingleUser,
    updateGeofence,
};
