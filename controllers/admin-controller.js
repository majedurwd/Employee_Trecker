const bcrypt = require("bcrypt");

const RegisterUser = require("../models/RegisterUser");
const UserProfile = require("../models/UserProfile")
const UserEmergencyContact = require("../models/UserEmergencyContact")
const Location = require("../models/Location");
const customErrorMsg = require("../utilities/custom-error-msg");
const JwtService = require("../utilities/jwt-service");

/**
 * Login Admin
 * @method POST
*/
const loginAdmin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const admin = await RegisterUser.findOne({ email: email });
        console.log(admin);

        // Check email
        if (!admin)
            return next(customErrorMsg.notAccept("Authoraization faild!"));
        // Match Password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch)
            return next(customErrorMsg.notAccept("Authoraization faild!"));
        if (!admin.roles.includes("ADMINISTRATOR"))
            return next(customErrorMsg.notAccept("Authoraization faild!"));

        const payload = {
            id: admin._id,
            email: admin.email,
            roles: admin.roles,
        };
        const accessToken = JwtService.sign(payload);
        const userProfile = await UserProfile.findOne({ userId: admin._id });
        console.log(userProfile)
        const userEmergency = await UserEmergencyContact.findOne({
            userId: admin._id,
        });

        const location = await Location.findOne({ userId: admin._id });

        res.status(200).json({
            success: true,
            token: accessToken,
            userId: admin._id,
            email: admin.email,
            location: location ?? null,
            adminDetails: userProfile ?? null,
            adminEmergency: userEmergency ?? null,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Admin get all user details info
 * @method GET
*/
const getAllUser = async (_req, res, next) => {
    try {
        const userPerPage = 5;
        const countUser = await RegisterUser.countDocuments();
        const regiterData = await RegisterUser.find();
        const userData = await UserProfile.find();
        const emergencyData = await UserEmergencyContact.find();
        const location = await Location.find()

        const users = regiterData.map((el) => ({
            user: el,
            profile:
                userData.find(
                    (d) => d.userId.toString() === el._id.toString()
                ) || null,
            emergency:
                emergencyData.find(
                    (d) => d.userId.toString() === el._id.toString()
                ) || null,
            location:
                location.find(
                    (d) => d.userId.toString() === el._id.toString()
                ) || null,
            
        }));
        res.status(200).json({
            total: countUser,
            users: users,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Admin get single user details info
 * @method GET
*/
const getSingleUser = async (req, res, next) => {
    try {
        const registerData = await RegisterUser.findById(req.params.userId);
        const userData = await UserProfile.findOne({ userId: req.params.userId });
        const emergencyData = await UserEmergencyContact.findOne({ userId: req.params.userId });
        const location = await Location.findOne({ userId: req.params.userId });

        res.status(200).json({
            user: registerData,
            profile: userData ?? null,
            emergency: emergencyData ?? null,
            location: location ?? null,
        })


    } catch (err) {
        next(err)
    }
}

// Admin change user profile
const updateUserProfileByAdmin = async (req, res, next) => {
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
        const registedUser = await RegisterUser.findById(req.params.userId);
        if (!registedUser)
            return next(customErrorMsg.notFound("This user is not registerd!"));
        const userData = await UserProfile.findOne({
            userId: req.params.userId,
        });
        if (!userData) {
            const newUserData = new UserProfile({
                userId: registedUser._id,
                ...req.body,
            });
            await newUserData.save()
            return res.status(200).json({
                success: true,
                msg: "New user profile created",
                userData: newUserData,
            });
        }

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
}

// Admin change user emergency
const updateUserEmergencyByAdmin = async (req, res, next) => {
    try {
        const { title, firstName, middleName, surName, phone, relation } =
            req.body;
        const registedUser = await RegisterUser.findById(req.params.userId)
        if (!registedUser)
            return next(customErrorMsg.notFound("This user is not registerd!"))
        const emergencyData = await UserEmergencyContact.findOne({
            userId: req.params.userId,
        })

        if (!emergencyData) {
            const newEmergencyData = new UserEmergencyContact({
                userId: registedUser._id,
                ...req.body,
            })
            await newEmergencyData.save()
            return res.status(200).json({
                success: true,
                msg: "New user emergency contact created",
                emergencyData: newEmergencyData
            })
        }

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
}

/**
 * 
*/
const updateLocation = async (req, res, next) => {
    try {
        const { lat, long, radius } = req.body; 
        const location = await Location.findOne({ userId: req.params.userId })
        if (!location) {
            const newLocation = new Location({
                userId: req.params.userId,
                lat: lat,
                long: long,
                radius: radius
            })
            await newLocation.save()
            return res.status(200).json({
                success: true,
                msg: "New location inserted"
            })
        }
        location.userId = req.params.userId,
        location.lat = lat ?? location.lat
        location.long = long ?? location.long
        location.radius = radius ?? location.radius
        await location.save()
        return res.status(200).json({
            success: true,
            msg: "location updated",
        });
        
        
    } catch (err) {
        next(err)
    }
}

module.exports = {
    loginAdmin,
    getAllUser,
    getSingleUser,
    updateLocation,
    updateUserProfileByAdmin,
    updateUserEmergencyByAdmin,
};
