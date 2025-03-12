import SeekerDetails from "../models/SeekerDetails.model.js";
import mongoose from "mongoose";

export const getSeekerDetails = async (req, res) => {
    try {
        const { _id } = req.params; 

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ message: "Invalid SeekerDetails ID" });
        }

        const seekerDetails = await SeekerDetails.findById(_id);
        if (!seekerDetails) {
            return res.status(404).json({ message: "SeekerDetails user not found" });
        }

        res.status(200).json(seekerDetails);
    } catch (error) {
        console.error("Error in getSeekerDetails:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const postSeekerDetails = async (req, res) => {
    try {
        const { _id } = req.body; 

        if (!_id) {
            return res.status(400).json({ message: "_id (Auth user ID) is required" });
        }

        const existingSeekerDetails = await SeekerDetails.findById(_id);
        if (existingSeekerDetails) {
            return res.status(400).json({ message: "SeekerDetails already exists for this user" });
        }

        const seekerDetails = new SeekerDetails({ _id, ...req.body }); 
        await seekerDetails.save();

        res.status(201).json(seekerDetails);
    } catch (error) {
        console.error("Error in postSeekerDetails:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const updateSeekerDetails = async (req, res) => {
    try {
        const { _id } = req.params; 

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ message: "Invalid SeekerDetails ID" });
        }

        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "No fields provided for update" });
        }

        const updatedSeekerDetails = await SeekerDetails.findByIdAndUpdate(
            _id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedSeekerDetails) {
            return res.status(404).json({ message: "SeekerDetails user not found" });
        }

        res.status(200).json(updatedSeekerDetails);
    } catch (error) {
        console.error("Error in updateSeekerDetails:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
