import mongoose from "mongoose";

const seekerDetailsSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auth", 
            required: true
        },
        fullName: { type: String },
        phoneNumber: { type: String },
        dateOfBirth: { type: String }, 
        gender: { type: String },
        address: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String },
        pincode: { type: String },
        skills: { type: [String] },
        projectUrl: { type: String },
        summary: { type: String },

        // Education Details
        eduDegree: { type: String },
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
