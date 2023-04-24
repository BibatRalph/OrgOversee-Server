import mongoose from "mongoose";
import TimeOffModel from "../mongodb/models/timeOff.js";
import User from "../mongodb/models/user.js";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getallOff = async (req,res) => {
     //Pagination,Sort,Search and Filter 
    const {
        _end,
        _order,
        _start,
        _sort,
        jobTitle_like = "",
        jobType = "",
    } = req.query;

    const query = {};

    if (jobType !== "") {
        query.jobType = jobType;
    }

    if (jobTitle_like) {
        query.jobTitle = { $regex: jobTitle_like, $options: "i" };
    }

    try {
        const count = await jobModel.countDocuments({ query });

        const Job = await jobModel.find(query)
            .limit(_end)
            .skip(_start)
            .sort({ [_sort]: _order });

        res.header("x-total-count", count);
        res.header("Access-Control-Expose-Headers", "x-total-count");

        res.status(200).json(Job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getOffInfo = async (req,res) => {
    const {id} = req.params;
    const JobExists = await jobModel.findOne({_id: id}).populate('creator');
    if (JobExists) {
        res.status(200).json(JobExists)} else {
            res.status(400).json({message: 'Job not found!'});
        }
    };

const createOff= async (req,res) => {
    try {
        const {date,name,id,email} = req.body;
    //New session for Atomic Creation of Job
    const session = await mongoose.startSession();
    session.startTransaction();
 
    const user = await User.findOne({ email }).session(session);
    if (!user) throw new Error("User not found");

    const newJob = await TimeOffModel.create({
        date,name,id,email,
        creator: user._id, 
    });
    
    // user.allJobs.push(newJob._id);

    await user.save({ session });

    await session.commitTransaction();

    res.status(200).json({ message: "Time-Off created successfully" });
} catch (error) {
    res.status(500).json({ message: error.message });
}
};

const updateOff = async (req,res) => {
    try {
        const { id } = req.params;
        const { jobTitle,
            department,
            jobType,
            description,
            location,
            experience,
            skillSet,
            Salary,} = req.body;

        await jobModel.findByIdAndUpdate(
            { _id: id },
            {
            jobTitle,
            department,
            jobType,
            description,
            location,
            experience,
            skillSet,
            Salary,
            },
        );

        res.status(200).json({ message: "Job updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};
const deleteOff = async (req,res) => {
    try {
        const { id } = req.params;

        const JobDelete = await jobModel.findById({ _id: id }).populate(
            "creator",
        );

        if (!JobDelete) throw new Error("Job not found");

        const session = await mongoose.startSession();
        await session.withTransaction(async () => {

        JobDelete.remove({ session });
        JobDelete.creator.allJobs.pull(JobDelete);

        await JobDelete.creator.save({ session });
        await session.commitTransaction();
    });
        res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    getallOff,
    getOffInfo,
    createOff,
    updateOff,
    deleteOff,
}