const Category = require('../../models/category');
const { successResponseData, errorResponseData } = require('../../services/Response');

const CategoryController = {
  // Get all categories with subcategories
  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.find({ 
        status: '1',
        isMainCategory: true 
      })
      .populate({
        path: 'subcategories',
        match: { status: '1' },
        select: 'name icon image slug productsCount'
      })
      .select('name icon image slug productsCount description')
      .sort({ sortOrder: 1, name: 1 });

      // Transform data to match frontend expectations
      const transformedCategories = categories.map((category, index) => ({
        id: category._id,
        name: category.name,
        icon: category.icon || 'fi fi-tr-grid',
        image: category.image || '',
        slug: category.slug,
        description: category.description,
        item: category.productsCount || 0,
        num: index + 1,
        persantine: '', // You can add discount logic here if needed
        subcategories: category.subcategories?.map(sub => ({
          id: sub._id,
          name: sub.name,
          icon: sub.icon || 'fi fi-tr-grid',
          image: sub.image || '',
          slug: sub.slug,
          item: sub.productsCount || 0
        })) || []
      }));

      return successResponseData(res, {
        data: transformedCategories,
        message: 'Categories fetched successfully'
      });

    } catch (error) {
      console.error('Error fetching categories:', error);
      return errorResponseData(res, 'Failed to fetch categories');
    }
  },

  // Get single category with subcategories
  getCategoryById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const category = await Category.findById(id)
        .populate({
          path: 'subcategories',
          match: { status: '1' },
          select: 'name icon image slug productsCount'
        })
        .select('name icon image slug productsCount description');

      if (!category) {
        return errorResponseData(res, 'Category not found', 404);
      }

      const transformedCategory = {
        id: category._id,
        name: category.name,
        icon: category.icon || 'fi fi-tr-grid',
        image: category.image || '',
        slug: category.slug,
        description: category.description,
        item: category.productsCount || 0,
        subcategories: category.subcategories?.map(sub => ({
          id: sub._id,
          name: sub.name,
          icon: sub.icon || 'fi fi-tr-grid',
          image: sub.image || '',
          slug: sub.slug,
          item: sub.productsCount || 0
        })) || []
      };

      return successResponseData(res, {
        data: transformedCategory,
        message: 'Category fetched successfully'
      });

    } catch (error) {
      console.error('Error fetching category:', error);
      return errorResponseData(res, 'Failed to fetch category');
    }
  }
};

module.exports = CategoryController;