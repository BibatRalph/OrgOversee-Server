import mongoose from "mongoose";

const empSchema = new mongoose.Schema({
    // required non-editable
    photo: { type: String, required: true },
    email: { type: String, required: true },
    jobID: { type: String, required: true },
    name: { type: String, required: true },
    // non-required
    persoEmail: { type: String, required: false },
    location: { type: String, required: false },
    gender: { type: String, required: false },
    age: { type: Number, required: false },
    description: { type: String, required: false },
    // non-editable
    jobTitleTarget: { type: String, required: false },
    // others
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    jobtarget: { type: mongoose.Schema.Types.ObjectId, ref: "Jobs" },
});

const empModel = mongoose.model("Employee", empSchema);

export default empModel;
