import mongoose from "mongoose";

const hosterDetailsSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auth",
            required: true
        },
        fullName: { type: String, required: true },
        phoneNumber: { type: String, required: true, minlength: 1 },
        companyURL: { type: String },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
        },
        address: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        pincode: { type: String },
    },
    {
        timestamps: true,
        _id: false
    }
);

const HosterDetails = mongoose.model("HosterDetails", hosterDetailsSchema);

export default HosterDetails;
