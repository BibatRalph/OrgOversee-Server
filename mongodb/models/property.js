import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema({
    // required
    photo: { type: String, required: true },
    email: { type: String, required: true },
    jobID: { type: String, required: true },
    // non-required
    propertyType: { type: String, required: false },
    location: { type: String, required: false },
    price: { type: Number, required: false },
    title: { type: String, required: false },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    jobtarget: { type: mongoose.Schema.Types.ObjectId, ref: "Jobs" },
});

const propertyModel = mongoose.model("Property", PropertySchema);

export default propertyModel;
