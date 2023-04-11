import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    jobTitle: { type: String, required: true },
    department: { type: String, required: true },
    jobType: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    experience: { type: String, required: true },
    skillSet: { type: Array, required: true },
    Salary: { type: Number, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const jobModel = mongoose.model("Job", jobSchema);

export default jobModel;