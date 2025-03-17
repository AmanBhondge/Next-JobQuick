import HosterDetails from "../models/hoster.model.js";
import Auth from "../models/auth.model.js"; 
import mongoose from "mongoose";

const validGenders = ["Male", "Female", "Other"];

export const getHosterDetails = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid HosterDetails ID" });
        }
        const hosterDetails = await HosterDetails.findById(id);
        if (!hosterDetails) {
            return res.status(404).json({ message: "Hoster user not found" });
        }
        res.status(200).json(hosterDetails);
    } catch (error) {
        console.error("Error in getHosterDetails:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const postHosterDetails = async (req, res) => {
    try {
        const { _id, gender } = req.body; 

        if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ message: "Valid _id (Auth user ID) is required" });
        }

        const authUser = await Auth.findById(_id);
        if (!authUser) {
            return res.status(404).json({ message: "User not found in Auth collection" });
        }

        if (authUser.role !== "hoster") {
            return res.status(403).json({ message: "Only hosters can create HosterDetails" });
        }

        const existingHosterDetails = await HosterDetails.findById(_id);
        if (existingHosterDetails) {
            return res.status(400).json({ message: "Hoster details already exist for this user" });
        }

        if (gender && !validGenders.includes(gender)) {
            return res.status(400).json({ message: `Invalid gender. Allowed values: ${validGenders.join(", ")}` });
        }

        const hosterDetails = new HosterDetails({ _id, ...req.body }); 
        await hosterDetails.save();

        res.status(201).json(hosterDetails);
    } catch (error) {
        console.error("Error in postHosterDetails:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateHosterDetails = async (req, res) => {
    try {
        const { id } = req.params; 

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid HosterDetails ID" });
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

        const updatedHosterDetails = await HosterDetails.findByIdAndUpdate(
            id, 
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedHosterDetails) {
            return res.status(404).json({ message: "Hoster user not found" });
        }

        res.status(200).json(updatedHosterDetails);
    } catch (error) {
        console.error("Error in updateHosterDetails:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
