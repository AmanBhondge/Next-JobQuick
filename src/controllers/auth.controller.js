import { generateToken } from "../lib/token-generator.lib.js";
import Auth from "../models/auth.model.js";
import bcrypt from "bcryptjs";
import Applicant from "../models/applicant.model.js";
import SeekerDetails from "../models/seeker.model.js";
import HosterDetails from "../models/hoster.model.js";
import Job from "../models/job.model.js";
import mongoose from "mongoose";

export const signup = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    if (!["seeker", "hoster"].includes(role)) {
      return res.status(400).json({ message: "Invalid role. Must be 'seeker' or 'hoster'." });
    }

    const userExists = await Auth.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new Auth({
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({
      _id: newUser._id,
      email: newUser.email,
      role: newUser.role,
    });

  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Auth.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      _id: user._id,
      email: user.email,
      role: user.role,
      token,
    });

  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteSeekerUser = async (req, res) => {
  try {
    const { seekerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(seekerId)) {
      return res.status(400).json({ success: false, message: "Invalid seeker ID" });
    }

    const seeker = await Auth.findById(seekerId);
    if (!seeker) {
      return res.status(404).json({ success: false, message: "Seeker not found" });
    }

    if (seeker.role !== "seeker") {
      return res.status(403).json({ success: false, message: "User is not a seeker" });
    }

    await Applicant.deleteMany({ applicantId: seekerId });

    await SeekerDetails.findByIdAndDelete(seekerId);

    await Auth.findByIdAndDelete(seekerId);

    res.status(200).json({ success: true, message: "Seeker and related data deleted successfully" });
  } catch (error) {
    console.error("Error deleting seeker:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteHosterUser = async (req, res) => {
  try {
    const { hosterId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(hosterId)) {
      return res.status(400).json({ success: false, message: "Invalid hoster ID" });
    }

    const hoster = await Auth.findById(hosterId);
    if (!hoster) {
      return res.status(404).json({ success: false, message: "Hoster not found" });
    }

    if (hoster.role !== "hoster") {
      return res.status(403).json({ success: false, message: "User is not a hoster" });
    }

    await HosterDetails.findByIdAndDelete(hosterId);

    const jobs = await Job.find({ createdBy: hosterId });

    if (jobs.length > 0) {
      const jobIds = jobs.map(job => job._id);

      await Applicant.deleteMany({ jobId: { $in: jobIds } });

      await Job.deleteMany({ createdBy: hosterId });
    }

    await Auth.findByIdAndDelete(hosterId);

  } catch (error) {
    console.error("Error deleting hoster:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
