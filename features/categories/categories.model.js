const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const CategorySchema = new Schema({
    name: {type: String, required: true},
    slug: {type: String, required: true, unique: true}
}, {
    timestamps: true
})
const Category = model('Category', CategorySchema, 'categories');

module.exports = { Category, CategorySchema };
