const slugify = require('slugify');
const { Category } = require('./categories.model');
const { Blog } = require('../blogs/blogs.model');

module.exports.createCategory = async (req, res) => {
    let { name, slug } = req.body;
    if (!slug) {
        slug = slugify(name).toLowerCase();
    }
    try {
        const exist = await Category.findOne({ slug });
        if (exist) {
            return res.json(400).json({
                error: `ERROR: Slug of ${name} already exist`,
            })
        }
        const newCategory = new Category({ name, slug });
        const category = await newCategory.save();
        return res.status(201).json({
            message: 'SUCCESS',
            res: category
        })

    } catch (error) {
        return res.status(500).json({
            error: 'ERROR: Some errors occur on Server'
        })
    }
}

module.exports.getCategories = async (req, res) => {
    let { page = 1, limit = 10 } = req.query;
    page = Number(page);
    limit = Number(limit);

    try {
        const categories = await Category.find()
            .skip(limit * (page - 1))
            .limit(limit)
            .sort([['createdAt', -1]])
        if (categories) {
            return res.status(200).json({
                message: 'SUCCESS',
                res: {
                    categories: {
                        page,
                        limit,
                        count: categories.length,
                        data: categories
                    }
                }
            })
        }

    } catch (error) {
        return res.status(500).json({
            error: 'ERROR: Some errors occur on Server'
        })
    }
}

module.exports.getCategory = async (req, res) => {
    let { page = 1, limit = 10 } = req.query;
    let { slug } = req.params;
    page = Number(page);
    limit = Number(limit);
    try {
        const category = await Category.findOne({ slug });
        if (!category) {
            return res.status(404).json({
                error: `Category ${slug} not found`
            })
        }
        const blogs = await Blog.find({ categories: category._id })
            .skip(limit * (page - 1))
            .limit(limit)
            .select('-content')
            .sort([['createdAt', -1]]);
        return res.status(200).json({
            message: 'SUCCESS',
            res: {
                category,
                blogs: {
                    page,
                    limit,
                    count: blogs.length,
                    data: blogs
                }
            }
        })

    } catch (error) {
        return res.status(500).json({
            error: 'ERROR: Some errors occur on Server'
        })
    }
}

module.exports.deleteCategoryById = async (req, res) => {
    let { id } = req.params;
    try {
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                error: `Category ${id} not found`
            })
        }
        await Category.deleteOne({ _id: id });
        return res.status(200).json({
            message: 'SUCCESS'
        })

    } catch (error) {
        return res.status(500).json({
            error: 'ERROR: Some errors occur on Server'
        })
    }
}

