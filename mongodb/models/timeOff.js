import mongoose from "mongoose";

const OffSchema = new mongoose.Schema({
    name: { type: String, required: false },
    id: { type: String, required: false },
    hiringManager: { type: String, required: true },
    date: { type: Date, required: true },
    email: { type: String, required: false },
    avatar: { type: String, required: false },
    offStats: { type: String, required: false },
    // OTHERS
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const TimeOffModel = mongoose.model("TimeOff", OffSchema);

export default TimeOffModel;
