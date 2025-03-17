import mongoose from "mongoose";

const jobSchema = mongoose.Schema({
    companyName: { type: String, required: true },
    companyEmail: { type: String, required: true },
    companyURL: { type: String, required: true },
    fullName: { type: String, required: true },
    phoneNo: { type: String, required: true },
    numOfEmployee: { type: Number, required: true },
    title: { type: String, required: true },
    jobType: { type: String, required: true },
    location: { type: String, required: true },
    workType: { type: String, required: true },
    minEducation: { type: String, required: true },
    experience: { type: String, required: true },
    interviewType: { type: String, required: true },
    companyDescription: { type: String, required: true },
    jobDescription: { type: String, required: true },
    noOfOpening: { type: Number, required: true, min: 1 },
    minPackage: { type: String, required: true },
    maxPackage: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategories: [{ type: String }],
    dateCreated: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', required: true },
    skills: {
        type: [String],
        required: true,
        validate: {
            validator: function (skills) {
                return skills.length > 0;
            },
            message: 'At least one skill is required.'
        }
    }
},
    { timestamps: true });

jobSchema.index({ title: "text", companyName: "text", jobType: 1, location: 1 });

const Job = mongoose.model('Job', jobSchema);

export default Job;