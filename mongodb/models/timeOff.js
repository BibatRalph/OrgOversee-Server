import mongoose from "mongoose";

const OffSchema = new mongoose.Schema({
    name: { type: String, required: false },
    id: { type: String, required: false },
    date: { type: Object, required: true },
    email: { type: String, required: false },
    avatar: { type: String, required: false },
    offStats: { type: String, required: false },
});

const TimeOffModel = mongoose.model("TimeOff", OffSchema);

export default TimeOffModel;
