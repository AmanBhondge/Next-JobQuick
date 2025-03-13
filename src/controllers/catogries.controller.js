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
    const { title } = req.body; 

    try {
        if (!title) {
            return res.status(400).json({ message: "Category title is required" });
        }

        const categoryExists = await Category.findOne({ title });
        if (categoryExists) {
            return res.status(400).json({ message: "Category already exists" });
        }

        const newCategory = new Category({ title });
        await newCategory.save();

        res.status(201).json(newCategory);
    } catch (error) {
        console.error("Error in postCategories:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
