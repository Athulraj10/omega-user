const router = require('express').Router();
const CategoryController = require('../../controllers/app/categoryController');

// Get all categories with subcategories
router.get('/', CategoryController.getAllCategories);

// Get single category by ID
router.get('/:id', CategoryController.getCategoryById);

module.exports = router;