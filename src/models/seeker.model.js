import mongoose from "mongoose";

const seekerDetailsSchema = new mongoose.Schema(
    {
        seekerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auth",
            required: true
        },
        fullName: { type: String,},
        phoneNumber: { type: String },
        dateOfBirth: { type: Date },
        gender: { type: String },
        address: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String },
        pincode: { type: String },
        skills: { type: [String] },
        projectUrl: { type: String },
        summary: { type: String },
        resume: { type: String },

        // Education Details
        eduDegree: { type: String },
        eduInstitution: { type: String },
        eduSpecialisation: { type: String },
        eduStartYear: { type: Date },
        eduEndYear: { type: Date },

        // Experience Details
        expCompany: { type: String },
        expPosition: { type: String },
        expStartYear: { type: Date },
        expEndYear: { type: Date },


    },
    {
        timestamps: true,
    }
);

const SeekerDetails = mongoose.model("SeekerDetails", seekerDetailsSchema);

export default SeekerDetails;
