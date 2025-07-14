# Banner API Documentation

This document describes the Banner API endpoints for managing and retrieving banner information.

## Base URL
```
/api/v1/banners
```

## Endpoints

### 1. Get All Banners
**GET** `/api/v1/banners`

Retrieve all banners with optional filtering and pagination.

**Query Parameters:**
- `position` (optional): Filter by position (home, category, product, sidebar)
- `status` (optional): Filter by status (active, inactive)
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 20)
- `search` (optional): Search in title and description

**Example:**
```bash
GET /api/v1/banners?position=home&status=active&page=1&limit=10
```

### 2. Get Active Banners
**GET** `/api/v1/banners/active`

Retrieve only active banners that are currently visible (respects date ranges and device types).

**Query Parameters:**
- `position` (optional): Filter by position
- `deviceType` (optional): Filter by device type (all, desktop, mobile) (default: all)

**Example:**
```bash
GET /api/v1/banners/active?position=home&deviceType=mobile
```

### 3. Get Home Banners
**GET** `/api/v1/banners/home`

Retrieve banners specifically for the home page.

**Query Parameters:**
- `deviceType` (optional): Filter by device type (all, desktop, mobile) (default: all)

**Example:**
```bash
GET /api/v1/banners/home?deviceType=desktop
```

### 4. Get Category Banners
**GET** `/api/v1/banners/category`

Retrieve banners specifically for category pages.

**Query Parameters:**
- `deviceType` (optional): Filter by device type (all, desktop, mobile) (default: all)

**Example:**
```bash
GET /api/v1/banners/category
```

### 5. Get Sidebar Banners
**GET** `/api/v1/banners/sidebar`

Retrieve banners specifically for sidebar display.

**Query Parameters:**
- `deviceType` (optional): Filter by device type (all, desktop, mobile) (default: all)

**Example:**
```bash
GET /api/v1/banners/sidebar
```

### 6. Get Banners by Position
**GET** `/api/v1/banners/position/:position`

Retrieve banners for a specific position.

**Path Parameters:**
- `position`: The position to filter by (home, category, product, sidebar)

**Query Parameters:**
- `deviceType` (optional): Filter by device type (all, desktop, mobile) (default: all)

**Example:**
```bash
GET /api/v1/banners/position/home?deviceType=mobile
```

### 7. Get Banner by ID
**GET** `/api/v1/banners/:id`

Retrieve a specific banner by its ID.

**Path Parameters:**
- `id`: The banner ID

**Example:**
```bash
GET /api/v1/banners/64f8a1b2c3d4e5f6a7b8c9d0
```

## Banner Model Schema

```javascript
{
  title: String,           // Required: Banner title
  description: String,     // Optional: Banner description
  image: String,           // Required: Banner image URL
  link: String,            // Optional: Link URL when banner is clicked
  linkText: String,        // Optional: Text for the link button
  status: String,          // Enum: "active" | "inactive" (default: "active")
  position: String,        // Enum: "home" | "category" | "product" | "sidebar" (default: "home")
  priority: Number,        // For ordering banners (default: 0)
  startDate: Date,         // Optional: When banner should start showing
  endDate: Date,           // Optional: When banner should stop showing
  isActive: Boolean,       // Whether banner is active (default: true)
  targetAudience: String,  // Enum: "all" | "new" | "returning" (default: "all")
  deviceType: String,      // Enum: "all" | "desktop" | "mobile" (default: "all")
  createdAt: Date,         // Auto-generated
  updatedAt: Date          // Auto-generated
}
```

## Response Format

All endpoints return responses in the following format:

**Success Response:**
```json
{
  "success": true,
  "data": [...], // Array of banners or single banner object
  "message": "Success message",
  "meta": {
    "total": 10,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "statusCode": 400
}
```

## Usage Examples

### Frontend Integration

```javascript
// Get home page banners
const getHomeBanners = async () => {
  const response = await fetch('/api/v1/banners/home');
  const data = await response.json();
  return data.data; // Array of banner objects
};

// Get banners for mobile devices
const getMobileBanners = async (position) => {
  const response = await fetch(`/api/v1/banners/active?position=${position}&deviceType=mobile`);
  const data = await response.json();
  return data.data;
};
```

### React Component Example

```jsx
import React, { useState, useEffect } from 'react';

const BannerSlider = ({ position = 'home' }) => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(`/api/v1/banners/${position}`);
        const data = await response.json();
        if (data.success) {
          setBanners(data.data);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, [position]);

  if (loading) return <div>Loading banners...</div>;

  return (
    <div className="banner-slider">
      {banners.map((banner) => (
        <div key={banner._id} className="banner-item">
          <img src={banner.image} alt={banner.title} />
          <div className="banner-content">
            <h3>{banner.title}</h3>
            <p>{banner.description}</p>
            {banner.link && (
              <a href={banner.link} className="banner-link">
                {banner.linkText || 'Learn More'}
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BannerSlider;
```

## Seeding Data

To populate the database with sample banner data, run:

```bash
node seedBanners.js
```

This will create sample banners for testing purposes.

## Notes

- Banners are automatically filtered by date range if `startDate` and `endDate` are set
- Device-specific banners will only show for the specified device type
- Banners are sorted by priority (highest first) and then by creation date (newest first)
- All endpoints are public and don't require authentication 