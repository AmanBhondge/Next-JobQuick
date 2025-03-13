import mongoose from "mongoose";

const seekerDetailsSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auth",
            required: true
        },
        fullName: { type: String, required: true },
        phoneNumber: { type: String, required: true, minlength: 1 },
        dateOfBirth: { type: String },
        gender: {
            type: String, required: true,
            enum: ['Male', 'Female', 'Other']
        },
        address: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        pincode: { type: String },
        skills: { type: [String] },
        projectUrl: { type: String },
        summary: { type: String, required: true },

        // Education Details
        eduDegree: { type: String, required: true },
        eduInstitution: { type: String },
        eduSpecialisation: { type: String },
        eduStartYear: { type: String },
        eduEndYear: { type: String },

        // Experience Details
        expCompany: { type: String },
        expPosition: { type: String },
        expStartYear: { type: String },
        expEndYear: { type: String },
    },
    {
        timestamps: true,
        _id: false
    }
);

const SeekerDetails = mongoose.model("SeekerDetails", seekerDetailsSchema);

export default SeekerDetails;
