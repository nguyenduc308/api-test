const express = require('express');
const router = express.Router();
const { createBlog, getBlogs, getBlog, getRelatedBlogs, deleteBlog, updateBlog } = require('./blogs.control');
const { authentication, authorization } = require('../../middlewares/auth.middleware')


router.get('/', getBlogs);
router.get('/:slug', getBlog);
router.post('/', authentication, authorization(['admin']), createBlog);
router.patch('/', authentication, authorization(['admin']), updateBlog);
router.delete('/:slug', authentication, authorization(['admin']), deleteBlog);
router.get('/:slug/related', getRelatedBlogs);

module.exports = router;