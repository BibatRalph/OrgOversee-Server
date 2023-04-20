import mongoose from "mongoose";

const empSchema = new mongoose.Schema({
    // required non-editable
    photo: { type: String, required: true },
    email: { type: String, required: true },
    jobID: { type: String, required: true },
    name: { type: String, required: true },
    jobTitleTarget: { type: String, required: true },
    jobDepartmentTarget: { type: String, required: true },
    jobLocationTarget: { type: String, required: true },
    // non-required
    persoEmail: { type: String, required: false },
    location: { type: String, required: false },
    gender: { type: String, required: false },
    age: { type: Number, required: false },
    description: { type: String, required: false },
    // edit only
    stats: { type: Number, required: false },
    // others
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    jobtarget: { type: mongoose.Schema.Types.ObjectId, ref: "Jobs" },
});

const empModel = mongoose.model("Employee", empSchema);

export default empModel;
