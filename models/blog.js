const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: true
    },
    signedIn: {
        type: Boolean
    },
    gotBonus: {
        type: Boolean
    },
    userId: {
        type: Number,
        unique: true
    }
}, { timestamps: true });

const Blog = mongoose.model('Blogs', blogSchema);
module.exports = Blog;