import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'User email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
        },
        password: {
            type: String,
            required: [true, 'User password is required'],
            minlength: 6,
        },
        role: {
            type: String,
            required: [true, 'User role is required'],
            enum: ['seeker', 'hoster'],
        },
    },
    {
        timestamps: true, 
    }
);

const Auth = mongoose.model("Auth", authSchema);

export default Auth;