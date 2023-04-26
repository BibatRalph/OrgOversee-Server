import Property from "../mongodb/models/property.js";
import emp from "../mongodb/models/emp.js";
import User from "../mongodb/models/user.js";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getAllProperties = async (req, res) => {
    const {
        _end,
        _order,
        _start,
        _sort,
        name_like = "",
        stats = "",
    } = req.query;

    const query = {};

    if (stats !== "") {
        query.stats = stats;
    }

    if (name_like) {
        query.name = { $regex: name_like, $options: "i" };
    }

    try {
        const count = await emp.countDocuments({ query });

        const data = await emp.find(query)
            .limit(_end)
            .skip(_start)
            .sort({ [_sort]: _order });

        res.header("x-total-count", count);
        res.header("Access-Control-Expose-Headers", "x-total-count");

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPropertyDetail = async (req, res) => {
    const { id } = req.params;
    const propertyExists = await emp.findOne({ _id: id }).populate(
        "creator",
    );  
    if (propertyExists) {
        res.status(200).json(propertyExists);
        
    } else {
        res.status(404).json({ message: "Target Applicant to get not found" });
    }
};


//CREATE NEW
const createProperty = async (req, res) => {
    try {
        const {         
            // from front-end
            photo,
            email, // EMAIL CHECK if the User who click onboard is saved in our database
            jobID,
            name,
            jobTitleTarget,
            jobDepartmentTarget,
            jobLocationTarget,
            // Non-Required
             //personal info
             persoEmail,
             location,
             gender,
             age,
             description,
             jobOwner,
        } = req.body;

        const session = await mongoose.startSession();
        session.startTransaction();

        // find user and create session // Atomic process
        const user = await User.findOne({ email }).session(session);

        if (!user) throw new Error("User to create not found");

        const photoUrl = await cloudinary.uploader.upload(photo);
        const newApplicant = await emp.create({
            photo: photoUrl.url,
            email,
            jobID,
            name,
            jobTitleTarget,
            jobDepartmentTarget,
            jobLocationTarget,
            //personal info
            persoEmail,
            location,
            gender,
            age,
            description,
            // Other
            creator: user._id,
            jobtarget: jobID,
            jobOwner: jobOwner,
            stats: 0,
        });

        // create a instance for all 
        user.allProperties.push(newApplicant._id);
        
        await user.save({ session });

        await session.commitTransaction();

        res.status(200).json({ message: "Employee created successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const {         // from front-end
            photo,
            email,
            jobID,
            name,
            jobTitleTarget,
            jobDepartmentTarget,
            jobLocationTarget,
            // Non-Required
             //personal info
             persoEmail,
             location,
             gender,
             age,
             description,
             // non-editable
             stats,
        } = req.body;

        // const photoUrl = await cloudinary.uploader.upload(photo);

        await emp.findByIdAndUpdate(
            { _id: id },
            {
                     // from front-end
            photo,
            email,
            jobID,
            name,
            jobTitleTarget,
            jobDepartmentTarget,
            jobLocationTarget,
            // Non-Required
             //personal info
             persoEmail,
             location,
             gender,
             age,
             description,
             // non-editable
             stats,
            // photo: photoUrl.url || photo,
            },
        );

        res.status(200).json({ message: "Employee updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;

        const propertyToDelete = await emp.findById({ _id: id }).populate(
            "creator",
        );

        if (!propertyToDelete) throw new Error("Employee to delete not found");

        const session = await mongoose.startSession();
        session.startTransaction();

        propertyToDelete.remove({ session });
        propertyToDelete.creator.allProperties.pull(propertyToDelete);

        await propertyToDelete.creator.save({ session });
        await session.commitTransaction();

        res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    getAllProperties,
    getPropertyDetail,
    createProperty,
    updateProperty,
    deleteProperty,
};
