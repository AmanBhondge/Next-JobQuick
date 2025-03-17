import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    subcategories: [
        {
            title: { type: String},
            _id: false
        }
    ]
});

const Category = mongoose.model("Category", categorySchema);
export default Category;