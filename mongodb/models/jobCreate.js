import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    jobTitle: { type: String, required: false },
    department: { type: String, required: false },
    jobType: { type: String, required: false },
    description: { type: String, required: false },
    location: { type: String, required: false },
    experience: { type: String, required: false },
    skillSet: { type: Array, required: false },
    Salary: { type: Number, required: false },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    
    // Applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Props" }],
});

const jobModel = mongoose.model("Jobs", jobSchema);

export default jobModel;