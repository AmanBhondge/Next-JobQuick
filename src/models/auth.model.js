import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'user Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please fill a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'user Password is required'],
        minlength: 6,
    }
},
    {
        timestamps: true
    }
);

const Auth = mongoose.model("Auth", authSchema);

export default Auth;