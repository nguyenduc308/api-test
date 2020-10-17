
const express = require('express');
const router = express.Router();
const { getPopularBlogs, getBlogsByUserId } = require('./blogs.control');

router.get('/popular', getPopularBlogs);
router.get('/user-posts/:userId', getBlogsByUserId);

module.exports = router;