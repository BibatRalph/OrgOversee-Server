import Property from "../mongodb/models/property.js";
import User from "../mongodb/models/user.js";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
    cloud_name: "dzcenwimt",
    api_key: "539616251266156",
    api_secret: "kpaKG3wR4Lry-JdoxdYVXSk4eF8",
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
        const count = await Property.countDocuments({ query });

        const properties = await Property.find(query)
            .limit(_end)
            .skip(_start)
            .sort({ [_sort]: _order });

        res.header("x-total-count", count);
        res.header("Access-Control-Expose-Headers", "x-total-count");

        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPropertyDetail = async (req, res) => {
    const { id } = req.params;
    const propertyExists = await Property.findOne({ _id: id }).populate(
        "creator",
    );

    if (propertyExists) {
        res.status(200).json(propertyExists);
    } else {
        res.status(404).json({ message: "Applicant not found" });
    }
};

//CREATE NEW
const createProperty = async (req, res) => {
    try {
        const {
            // from front-end
            jobOwner,
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
        } = req.body;

        const session = await mongoose.startSession();
        session.startTransaction();

        // find user and create session // Atomic process
        const user = await User.findOne({ email }).session(session);

        if (!user) throw new Error("User not found, Try to Log-in first");


        const newApplicant = await Property.create({
            email,
            jobID,
            name,
            jobTitleTarget:jobTitleTarget,
            jobDepartmentTarget,
            jobLocationTarget,
            //personal info
            persoEmail,
            location,
            gender,
            age,
            description,
            // edit only
            stats: 0,
            result: "Ongoing",
            // Other
            creator: user._id,
            jobtarget: jobID,
            jobOwner,
       
        });

    
        // create a instance for all applicants 
        user.allProperties.push(newApplicant._id);
        
        await user.save({ session });

        await session.commitTransaction();

        res.status(200).json({ message: "Applicant created successfully" });
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
             // edit only
             stats,
             result,
        } = req.body;

        // const photoUrl = await cloudinary.uploader.upload(photo);

        await Property.findByIdAndUpdate(
            { _id: id },
            {
             // from front-end
            photo,
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
              // edit only
             stats, 
             result,
            // photo: photoUrl.url || photo,
            },
        );

        res.status(200).json({ message: "Applicant updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;

        const propertyToDelete = await Property.findById({ _id: id }).populate(
            "creator",
        );

        if (!propertyToDelete) throw new Error("Applicant to delete not found");

        const session = await mongoose.startSession();
        session.startTransaction();

        propertyToDelete.remove({ session });
        propertyToDelete.creator.allProperties.pull(propertyToDelete);

        await propertyToDelete.creator.save({ session });
        await session.commitTransaction();

        res.status(200).json({ message: "Applicant deleted successfully" });
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
