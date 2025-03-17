import mongoose from "mongoose";

const applicantSchema = mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Job'
    },
    applicantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Auth'
    },
    shortListed: {
        type: Boolean,
        default: false
    },
    dateApplied: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Applicant = mongoose.model('Applicant', applicantSchema);

export default Applicant;