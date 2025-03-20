import Job from '../models/job.model.js';
import mongoose from 'mongoose';
import Category from '../models/categories.model.js';
import Applicant from '../models/applicant.model.js';
import Auth from '../models/auth.model.js';

export const getFilteredJobs = async (req, res) => {
    try {
        let filter = {};

        if (req.query.categories) {
            const categoryTitles = req.query.categories.split(",").map(title => title.trim().toLowerCase());
            const categories = await Category.find({
                title: { $in: categoryTitles.map(title => new RegExp(`^${title}$`, "i")) }
            });
            if (categories.length) {
                filter.category = { $in: categories.map(cat => cat._id) };
            }
        }

        if (req.query.search) filter.$text = { $search: req.query.search.trim() };
        if (req.query.jobType) filter.jobType = { $regex: new RegExp(req.query.jobType.trim(), "i") };
        if (req.query.workType) filter.workType = { $regex: new RegExp(req.query.workType.trim(), "i") };
        if (req.query.experience) filter.experience = { $regex: new RegExp(req.query.experience.trim(), "i") };

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const jobList = await Job.find(filter)
            .populate("category", "title")
            .populate("createdBy", "email")
            .sort({ dateCreated: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const totalJobs = await Job.countDocuments(filter);

        res.status(200).json({
            success: true,
            jobs: jobList,
            pagination: {
                total: totalJobs,
                limit,
                page,
                totalPages: Math.ceil(totalJobs / limit),
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getDashboardJobs = async (req, res) => {
    try {
        const { creatorId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(creatorId)) {
            return res.status(400).json({ success: false, message: "Invalid creatorId" });
        }

        const jobs = await Job.find({ createdBy: creatorId })
            .populate("category", "title")
            .populate("createdBy", "fullName email");

        const totalJobs = await Job.countDocuments({ createdBy: creatorId });
        const jobIds = jobs.map(job => job._id);
        const totalApplicants = await Applicant.countDocuments({ jobId: { $in: jobIds } });
        const totalShortlisted = await Applicant.countDocuments({ jobId: { $in: jobIds }, shortListed: true });

        res.status(200).json({
            success: true,
            jobs,
            statistics: { totalJobs, totalApplicants, totalShortlisted }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getTableJobs = async (req, res) => {
    try {
        const { hosterId } = req.params;
        const { page = 1, limit = 10, shortlisted } = req.query;
        const skip = (page - 1) * limit;

        const jobs = await Job.find({ createdBy: hosterId }).select("_id title companyName jobType");

        if (!jobs.length) {
            return res.status(404).json({ error: "No jobs found for this user." });
        }

        const jobIds = jobs.map(job => job._id);

        const filterQuery = { jobId: { $in: jobIds } };

        if (shortlisted !== undefined) {
            filterQuery.shortListed = shortlisted === 'true';
        }

        const totalCount = await Applicant.countDocuments(filterQuery);
        const totalPages = Math.ceil(totalCount / limit);

        const applicants = await Applicant.find(filterQuery)
            .populate("applicantId", "fullName phoneNumber")
            .populate("jobId", "title companyName jobType")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.json({
            success: true,
            applicants,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalItems: totalCount,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error("Error fetching applicants:", error.message);
        res.status(500).json({ error: "Internal server error. Please try again." });
    }
};

export const getJobDetails = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ success: false, message: "Invalid Job ID format" });
        }

        const job = await Job.findById(req.params.id)
            .populate("category", "title")
            .populate("createdBy", "fullName email");

        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found!" });
        }

        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const postJob = async (req, res) => {
    try {
        const { createdBy, categoryTitle, subcategories, skills } = req.body;

        if (!createdBy || !mongoose.Types.ObjectId.isValid(createdBy)) {
            return res.status(400).json({ message: "Valid createdBy (Auth user ID) is required" });
        }

        const authUser = await Auth.findById(createdBy);
        if (!authUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (authUser.role !== "hoster") {
            return res.status(403).json({ message: "Only hosters can post jobs" });
        }

        if (!categoryTitle || typeof categoryTitle !== "string" || categoryTitle.trim() === "") {
            return res.status(400).json({ message: "Valid category title is required" });
        }

        const category = await Category.findOne({ title: categoryTitle.trim() });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        let validSubcategories = [];
        if (subcategories) {
            const subcategoryArray = Array.isArray(subcategories)
                ? subcategories
                : subcategories.split(",").map(s => s.trim());

            validSubcategories = subcategoryArray.filter(sub =>
                category.subcategories.some(catSub => catSub.title.toLowerCase() === sub.toLowerCase())
            );

            const invalidSubcategories = subcategoryArray.filter(sub =>
                !category.subcategories.some(catSub => catSub.title.toLowerCase() === sub.toLowerCase())
            );

            if (invalidSubcategories.length > 0) {
                return res.status(400).json({
                    message: `Invalid subcategories: ${invalidSubcategories.join(", ")}`,
                });
            }
        }

        if (!Array.isArray(skills) || skills.length === 0) {
            return res.status(400).json({ message: "At least one skill is required" });
        }

        const job = new Job({ ...req.body, category: category._id, subcategories: validSubcategories });

        const savedJob = await job.save();

        res.status(201).json({ success: true, message: "Job created successfully", job: savedJob });
    } catch (error) {
        console.error("Error in postJob:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateJob = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid job ID' });
        }

        const updatedJob = await Job.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

        res.status(200).json(updatedJob);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};