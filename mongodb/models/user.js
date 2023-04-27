import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String, required: true },
    role: { type: String, required: false },
    // All created application
    allProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Applicants" }],
    // All created jobs
    allJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Jobs" }],
     // All Employee jobs
     allEmp: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],

});

const userModel = mongoose.model("User", UserSchema);

export default userModel;
