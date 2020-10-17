const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const BlogSchema = new Schema({
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    views: { type: Number, default: 0 },
    slug: { type: String, required: true, unique: true },
    categories: [{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }],
    imageUrl: { type: String },
    content: { type: String, required: true }
}, {
    timestamps: true
})
const Blog = model('Blog', BlogSchema, 'blogs');

module.exports = { Blog, BlogSchema };
