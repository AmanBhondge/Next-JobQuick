import Category from '../models/categories.model.js';

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).json(categories);
    } catch (error) {
        console.error("Error in getCategories:", error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const postCategories = async (req, res) => {
    try {
        let { title, subcategories } = req.body;

        if (!title || typeof title !== "string" || title.trim() === "") {
            return res.status(400).json({ message: "Category title is required and must be a string" });
        }
        title = title.trim(); 

        const categoryExists = await Category.findOne({ title });
        if (categoryExists) {
            return res.status(400).json({ message: "Category already exists" });
        }

        if (subcategories && !Array.isArray(subcategories)) {
            return res.status(400).json({ message: "Subcategories must be an array" });
        }

        subcategories = subcategories?.filter(sub => typeof sub === "string" && sub.trim() !== "")
            .map(sub => ({ title: sub.trim() })) || [];

        const newCategory = new Category({ title, subcategories });
        await newCategory.save();

        res.status(201).json({ success: true, message: "Category created successfully", category: newCategory });
    } catch (error) {
        console.error("Error in postCategories:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};