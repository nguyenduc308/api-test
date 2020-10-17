const express = require('express');
const router = express.Router();

router.use('/blogs', require('./features/blogs/blogs.route'));
router.use('/extend', require('./features/blogs/extend.route'));
router.use('/categories', require('./features/categories/categories.route'));

router.use('/auth', require('./features/users/users.route'));

module.exports = router;