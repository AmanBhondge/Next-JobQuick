import SeekerDetails from "../models/seeker.model.js";
import Auth from "../models/auth.model.js";
import mongoose from "mongoose";

const validGenders = ["Male", "Female", "Other"];

export const getSeekerDetails = async (req, res) => {
    try {
        const { id } = req.params; 

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid SeekerDetails ID" });
        }

        const seekerDetails = await SeekerDetails.findById(id);
        if (!seekerDetails) {
            return res.status(404).json({ message: "Seeker user not found" });
        }

        res.status(200).json(seekerDetails);
    } catch (error) {
        console.error("Error in getSeekerDetails:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const postSeekerDetails = async (req, res) => {
    try {
        const { _id, fullName, phoneNumber, gender, city, state, country, summary, eduDegree } = req.body;

        const requiredFields = { _id, fullName, phoneNumber, gender, city, state, country, summary, eduDegree };
        for (const [key, value] of Object.entries(requiredFields)) {
            if (!value) {
                return res.status(400).json({ message: `${key} is required` });
            }
        }

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ message: "Valid _id (Auth user ID) is required" });
        }

        const authUser = await Auth.findById(_id);
        if (!authUser) {
            return res.status(404).json({ message: "User not found in Auth collection" });
        }

        if (authUser.role !== "seeker") {
            return res.status(403).json({ message: "Only seekers can create SeekerDetails" });
        }

        const existingSeekerDetails = await SeekerDetails.findById(_id);
        if (existingSeekerDetails) {
            return res.status(400).json({ message: "Seeker details already exist for this user" });
        }

        const validGenders = ["Male", "Female", "Other"];
        if (!validGenders.includes(gender)) {
            return res.status(400).json({ message: `Invalid gender. Allowed values: ${validGenders.join(", ")}` });
        }

        const seekerDetails = new SeekerDetails({ _id, ...req.body });
        await seekerDetails.save();

        res.status(201).json({ success: true, message: "Seeker details created successfully", seekerDetails });
    } catch (error) {
        console.error("Error in postSeekerDetails:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const updateSeekerDetails = async (req, res) => {
    try {
        const { id } = req.params; 

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid SeekerDetails ID" });
        }

        if (req.body._id) {
            return res.status(400).json({ message: "Cannot update _id field" });
        }

        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "No fields provided for update" });
        }

        if (req.body.gender && !validGenders.includes(req.body.gender)) {
            return res.status(400).json({ message: `Invalid gender. Allowed values: ${validGenders.join(", ")}` });
        }

        const updatedSeekerDetails = await SeekerDetails.findByIdAndUpdate(
            id, 
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedSeekerDetails) {
            return res.status(404).json({ message: "Seeker user not found" });
        }

        res.status(200).json(updatedSeekerDetails);
    } catch (error) {
        console.error("Error in updateSeekerDetails:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};