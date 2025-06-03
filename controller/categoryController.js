import categoryModel from "../models/categoryModel.js"
import slugify from 'slugify';

// creating category controller
export const createCategoryController = async (req, res) => {
    try {
        const { name } = req.body
        if (!name) {
            return res.status(401).send({ message: 'Name is required' })
        }
        // checking existing category

        const existingCategory = await categoryModel.findOne({ name })
        if (existingCategory) {
            return res.status(200).send({
                success: true,
                message: "Category Already Exists"
            })
        }
        const category = await new categoryModel({ name, slug: slugify(name) }).save();
        res.status(201).send({
            success: true,
            message: 'New Category Created',
            category,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error in Category',
        })
    }
}

// update category

export const updateCategoryController = async (req, res) => {
    try {
        const { name } = req.body
        const { id } = req.params
        const category = await categoryModel.findByIdAndUpdate(
            id,
            { name, slug: slugify(name) },
            { new: true }
        );
        res.status(200).send({
            success: true,
            message: "Category Updated Successfully",
            category
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "error while updating category"
        })
    }
};

// get all category

export const categoryControlller = async (req, res) => {
    try {
        const category = await categoryModel.find({});
        res.status(200).send({
            success: true,
            message: "List of All Category",
            category,
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while geting all Categories"
        })

    }
};

// single category controller

export const singleCategoryController = async (req, res) => {
    try {
        //const { slug } = req.params;
        const singleCatrgory = await categoryModel.findOne({ slug: req.params.slug })
        res.status(200).send({
            success: true,
            message: "Here is the single Category",
            singleCatrgory,
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: true,
            error,
            message: 'Error while loading single category'
        })
    }
};

export const deleteCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        await categoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success: true,
            message: "Successfuly deleted"
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error while deleting Category'
        })
    }
};