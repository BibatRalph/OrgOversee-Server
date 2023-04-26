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
    const {
        _end,
        _order,
        _start,
        _sort,
        offStats = "Pending",
    } = req.query;

    const query = {};

    if (offStats !== "") {
        query.offStats = offStats;
    }

    try {
        const count = await TimeOffModel.countDocuments({ query });

        const data = await TimeOffModel.find(query)
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

const createOff= async (req,res) => {
    try {
        const {date,name,id,email,avatar} = req.body;
    //New session for Atomic Creation of Job
    const session = await mongoose.startSession();
    session.startTransaction();
 
    const user = await User.findOne({ email }).session(session);
    if (!user) throw new Error("User not found, Try to Log-in first");

    const newOff = await TimeOffModel.create({
        date,name,id,email,avatar,creator: user._id,
        offStats:"Pending"
    }); 
    
    user.allOff.push(newOff._id);

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
        const { date,name,email,avatar,offStats} = req.body;

        await TimeOffModel.findByIdAndUpdate(
            { _id: id },
            {
                date,name,email,avatar,offStats
            },
        );

        res.status(200).json({ message: "Request updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};
const deleteOff = async (req,res) => {
    try {
        const { id } = req.params;

        const Delete = await TimeOffModel.findById({ _id: id })
        .populate(
            "creator",
        );

        if (!Delete) throw new Error("Request not found");

        const session = await mongoose.startSession();
        await session.withTransaction(async () => {

        Delete.remove({ session });
        
        Delete.creator.allOff.pull(Delete);

        await Delete.creator.save({ session });
      
        await session.commitTransaction();
    });
        res.status(200).json({ message: "Request deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    getallOff,
    createOff,
    updateOff,
    deleteOff,
}