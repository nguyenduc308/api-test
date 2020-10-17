const express = require('express');
const router = express.Router();
const { createCategory, getCategories, getCategory, deleteCategoryById } = require('./categories.control');
const { authentication, authorization } = require('../../middlewares/auth.middleware')

router.get('/', getCategories);
router.get('/:slug', getCategory);
router.delete('/:id', deleteCategoryById);
router.post('/', authentication, authorization(['admin']), createCategory);

module.exports = router;