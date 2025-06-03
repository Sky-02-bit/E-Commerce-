import mongoose from "mongoose";
import fs from 'fs' // importing file system
const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: mongoose.ObjectId,
        ref: 'Category', // linking product to our category model
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    photo: {
        data: Buffer,  // this is a type use to sava any file or image
        contentType: String,
    },
    shipping: {
        type: Boolean, // boolean type is used for showing order status
    },

}, { timestamps: true })

export default mongoose.model('Products', productSchema)