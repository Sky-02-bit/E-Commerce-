import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,

    },

    // using slugify from npm js . this convert space in '-' or '_'
    slug: {
        type: String,
        lowercase: true,
    },
})

export default mongoose.model('Category', categorySchema);