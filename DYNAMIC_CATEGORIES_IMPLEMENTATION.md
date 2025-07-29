# Dynamic Categories Implementation

## Overview
This implementation removes hardcoded category data from the frontend and replaces it with dynamic data fetched from the backend API.

## Backend Changes

### 1. Category Controller (`backend/src/controllers/app/categoryController.js`)
- **`getAllCategories`**: Fetches all main categories with their subcategories populated
- **`getCategoryById`**: Fetches a single category with its subcategories
- Transforms data to match frontend expectations
- Includes proper error handling

### 2. Category Routes (`backend/src/routes/api/categories.js`)
- **`GET /api/v1/categories`**: Get all categories
- **`GET /api/v1/categories/:id`**: Get single category

### 3. Category Seeder (`backend/src/seeders/categorySeeder.js`)
- Populates database with sample categories and subcategories
- Includes 9 main categories and 6 subcategories
- Run with: `node seedCategories.js`

## Frontend Changes

### 1. Custom Hook (`Recreating - front-end/src/hooks/useCategories.ts`)
- Manages category data fetching
- Provides loading and error states
- Includes refresh functionality

### 2. Next.js API Routes
- **`/api/categories`**: Proxies to backend `/api/v1/categories`
- **`/api/categories/[id]`**: Proxies to backend `/api/v1/categories/:id`

### 3. Updated Components
- **`Category.tsx`**: Now uses `useCategories` hook instead of hardcoded data
- **`CategoryItem.tsx`**: Updated to handle new data structure with TypeScript types
- **`category.ts`**: Hardcoded data removed, now exports empty array

## Database Schema

### Category Model Structure
```javascript
{
  name: String,           // Category name
  description: String,    // Category description
  icon: String,          // Icon class (e.g., 'fi fi-tr-peach')
  image: String,         // Category image URL
  slug: String,          // URL-friendly name
  isMainCategory: Boolean, // True for main categories
  parentCategory: ObjectId, // Reference to parent category (for subcategories)
  sortOrder: Number,     // Display order
  status: String,        // '1' for active, '0' for inactive
  productsCount: Number  // Virtual field for product count
}
```

## API Response Format

### Categories List Response
```json
{
  "data": [
    {
      "id": "category_id",
      "name": "Fruits",
      "icon": "fi fi-tr-peach",
      "image": "/images/categories/fruits.jpg",
      "slug": "fruits",
      "description": "Fresh and dried fruits",
      "item": 320,
      "num": 1,
      "persantine": "",
      "subcategories": [
        {
          "id": "subcategory_id",
          "name": "Tropical Fruits",
          "icon": "fi fi-tr-peach",
          "image": "/images/categories/tropical-fruits.jpg",
          "slug": "tropical-fruits",
          "item": 45
        }
      ]
    }
  ],
  "meta": {
    "code": 200,
    "message": "Categories fetched successfully"
  }
}
```

## Setup Instructions

### 1. Backend Setup
1. Ensure the backend server is running
2. Run the category seeder:
   ```bash
   cd backend
   node seedCategories.js
   ```

### 2. Frontend Setup
1. The frontend will automatically fetch categories when components load
2. No additional setup required

## Features

### ✅ Implemented
- Dynamic category fetching from backend
- Subcategory support
- Loading and error states
- TypeScript support
- Responsive design maintained
- SEO-friendly slugs
- Product count integration

### 🔄 Future Enhancements
- Category images upload
- Category management admin panel
- Category-based product filtering
- Category breadcrumbs
- Category-specific discounts

## Testing

### Backend API Testing
```bash
# Test categories endpoint
curl http://localhost:5000/api/v1/categories

# Test single category
curl http://localhost:5000/api/v1/categories/[category_id]
```

### Frontend Testing
1. Visit any page with the Category component
2. Check browser network tab for API calls
3. Verify categories load dynamically
4. Test responsive behavior

## Troubleshooting

### Common Issues
1. **Categories not loading**: Check backend server and database connection
2. **Empty categories**: Run the seeder script
3. **API errors**: Check Next.js API routes and backend endpoints
4. **TypeScript errors**: Ensure all types are properly imported

### Debug Steps
1. Check browser console for errors
2. Verify backend API responses
3. Check database for category data
4. Test API endpoints directly