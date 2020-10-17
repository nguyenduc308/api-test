const slugify = require('slugify');
const { Blog } = require('./blogs.model');
const { smartTrim } = require('../../helpers/trim-string');

module.exports.createBlog = async (req, res) => {
    let {
        title,
        slug,
        excerpt,
        categories,
        content,
        imageUrl
    } = req.body;

    if (!slug) {
        slug = slugify(title).toLowerCase();
    }
    if (!excerpt) {
        excerpt = smartTrim(content).replace(/<[^>]*>?/gm, '');
    }
    content = content.replace(/<blockquote>/gi, '<pre>');
    content = content.replace(/<\/blockquote > /gi, '</pre >')
    const authorId = req.user._id;
    try {
        const exist = await Blog.findOne({ slug });
        if (exist) return res.json(400, {
            error: `ERROR: Slug of ${name} already exist`,
        })
        const newBlog = new Blog({ title, imageUrl, slug, excerpt, author: authorId, categories, content });
        const blog = await newBlog.save();

        return res.status(201).json({
            message: "SUCCESS",
            res: blog
        })
    } catch (error) {
        return res.status(500).json({
            error: 'ERROR: Some errors occur on server'
        })
    }
}
module.exports.updateBlog = async (req, res) => {
    let {
        excerpt,
        content,
    } = req.body;

    if (!slug) {
        slug = slugify(title).toLowerCase();
    }
    if (!excerpt) {
        excerpt = smartTrim(content).replace(/<[^>]*>?/gm, '');
    }
    const update = {
        ...req.body, excerpt, slug
    }

    try {
        const blog = await Blog.findOne({ slug });
        if (exist) return res.json(400, {
            error: `ERROR: Blog not found`,
        })
        Object.entries(update).forEach(([key, value]) => {
            blog[key] = value;
        })

        await blog.save();

        return res.status(200).json({
            message: "SUCCESS",
            res: blog
        })
    } catch (error) {
        return res.status(500).json({
            error: 'ERROR: Some errors occur on server'
        })
    }
}

module.exports.getBlogs = async (req, res) => {
    let { page = 1, limit = 10 } = req.query;
    page = Number(page);
    limit = Number(limit);

    try {
        const blogs = await Blog.find()
            .skip(limit * (page - 1))
            .limit(limit)
            .select('-content')
            .populate('categories')
            .populate('author', '_id email firstName lastName')
            .sort({ 'createdAt': -1 })

        return res.status(200).json({
            message: "SUCCESS",
            res: {
                page,
                limit,
                count: blogs.length,
                data: blogs
            }
        })
    } catch (error) {
        return res.status(500).json({
            error: 'ERROR: Some errors occur on server'
        })
    }
}

module.exports.getBlog = async (req, res) => {
    const { slug } = req.params;
    try {
        const blog = await (await Blog.findOne({ slug }).populate('categories').populate('author', '_id email firstName lastName'));
        if (!blog) return res.status(200).json({
            error: `Blog ${slug} not found`
        })
        if (!blog.views) {
            blog.views = 0;
        }
        blog.views = blog.views + 1;
        await blog.save();
        return res.status(200).json({
            message: "SUCCESS",
            res: blog
        })
    } catch (error) {
        return res.status(500).json({
            error: 'ERROR: Some errors occur on server'
        })
    }
}

module.exports.getRelatedBlogs = async (req, res) => {
    let { blogId, categoryId, limit = 4 } = req.query;
    if (!blogId) return res.status(200).json({ res: [] });
    limit = Number(limit);

    try {
        const blogs = await Blog.find({ _id: { $ne: blogId }, categories: { $in: categoryId } })
            .limit(limit)
            .select('-content')
            .populate('categories');
        return res.status(200).json({
            message: 'SUCCESS',
            res: {
                limit,
                categoryId,
                blogId,
                count: blogs.length,
                data: blogs
            }
        })
    } catch (error) {
        return res.status(500).json({
            error: 'ERROR: Some errors occur on server',
            res: []
        })
    }
}

module.exports.getPopularBlogs = async (req, res) => {
    let { page = 1, limit = 4 } = req.query;
    limit = Number(limit);
    page = Number(page);

    try {
        const blogs = await Blog.find()
            .skip(limit * (page - 1))
            .limit(limit)
            .select('-content')
            .sort({ views: -1 })
            .populate('categories')
        return res.status(200).json({
            message: 'SUCCESS',
            res: {
                limit,
                page,
                count: blogs.length,
                data: blogs
            }
        })
    } catch (error) {
        return res.status(500).json({
            error: 'ERROR: Some errors occur on server'
        })
    }
}
module.exports.getBlogsByUserId = async (req, res) => {
    let { page = 1, limit = 2 } = req.query;
    limit = Number(limit);
    page = Number(page);
    const { userId } = req.params;
    try {
        const blogs = await Blog.find({ author: userId })
            .skip(limit * (page - 1))
            .limit(limit)
            .select('-content')
            .sort({ views: -1 })
            .populate('categories');

        return res.status(200).json({
            message: 'SUCCESS',
            res: {
                limit,
                page,
                count: blogs.length,
                data: blogs
            }
        })
    } catch (error) {
        return res.status(500).json({
            error: 'ERROR: Some errors occur on server'
        })
    }
}



module.exports.deleteBlog = async (req, res) => {
    const { slug } = req.params;
    try {
        const blog = await Blog.findOneAndDelete({ slug })
        if (!blog) return res.status(200).json({
            error: `Blog ${slug} not found`
        })

        return res.status(200).json({
            message: "SUCCESS",
        })
    } catch (error) {
        return res.status(500).json({
            error: 'ERROR: Some errors occur on server'
        })
    }
}
