import mongoose from "mongoose";
import jobModel from "../mongodb/models/jobCreate.js";
import User from "../mongodb/models/user.js";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getAllJobs = async (req,res) => {};
const getJobDetail = async (req,res) => {};

const createJob = async (req,res) => {
    try {
        const {jobTitle,department,jobType,description,location,experience,skillSet,Salary,email,} = req.body;

    //New session for Atomic Creation of Job
    const session = await mongoose.startSession();
    session.startTransaction();
 
    const user = await User.findOne({ email }).session(session);
    if (!user) throw new Error("User not found");

    const newJob = await jobModel.create({
        jobTitle,department,jobType,description,location,experience,skillSet,Salary,
        creator: user._id,
    });

    user.allJobs.push(newJob._id);
        
    await user.save({ session });

    await session.commitTransaction();

    res.status(200).json({ message: "Job created successfully" });
} catch (error) {
    res.status(500).json({ message: error.message });
}
};

const updateJob = async (req,res) => {};
const deleteJob = async (req,res) => {};

export {
    getAllJobs,
    getJobDetail,
    createJob,
    updateJob,
    deleteJob,
}