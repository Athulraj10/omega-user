# Responsive Design Guide for Cart, Wishlist & Quantity Components

## Overview
This guide documents the comprehensive responsive design implementation for cart, wishlist, and quantity selector components across all device sizes.

## Breakpoints

### Large Desktop (1200px+)
- **Quantity Selector**: 140px min-width, 32px buttons
- **Cart Button**: 180px min-width, 16px font
- **Wishlist/Quickview**: 44px buttons, 18px icons
- **Sidebar Cart**: 400px width, 70px product images
- **Cart Buttons**: 14px padding, 16px font

### Desktop (992px - 1199px)
- **Quantity Selector**: 130px min-width
- **Cart Button**: 160px min-width, 12px padding
- **Sidebar Cart**: 380px width
- **Cart Buttons**: 12px gap

### Tablet (768px - 991px)
- **Quantity Selector**: 120px min-width, 28px buttons, 14px font
- **Cart Button**: 140px min-width, 10px padding, 14px font
- **Wishlist/Quickview**: 38px buttons, 15px icons
- **Sidebar Cart**: 350px width, 55px product images
- **Cart Buttons**: Column layout, 8px gap, 10px padding
- **Cart Table**: 14px font, 16px total price

### Mobile Large (576px - 767px)
- **Quantity Selector**: Column layout, 110px min-width, 26px buttons, 13px font
- **Cart Button**: Full width, 12px padding, 14px font, 8px margin
- **Wishlist/Quickview**: 36px buttons, 14px icons, centered
- **Sidebar Cart**: 320px width, 50px product images
- **Cart Items**: 12px padding, 14px title, 13px price
- **Cart Buttons**: Column layout, 8px gap, 12px padding
- **Cart Table**: 13px font, 15px total price, 6px padding

### Mobile Small (up to 575px)
- **Quantity Selector**: Column layout, 100px min-width, 24px buttons, 12px font
- **Cart Button**: Full width, 10px padding, 13px font, 6px margin
- **Wishlist/Quickview**: 32px buttons, 13px icons, centered
- **Sidebar Cart**: 100% width, max 300px, 45px product images
- **Cart Items**: 10px padding, 13px title, 12px price
- **Cart Buttons**: Column layout, 6px gap, 10px padding
- **Cart Table**: 12px font, 14px total price, 4px padding
- **Login Prompts**: 12px padding, 13px font

### Extra Small Mobile (up to 375px)
- **Quantity Selector**: 90px min-width, 22px buttons, 11px font
- **Cart Button**: 8px padding, 12px font
- **Wishlist/Quickview**: 28px buttons, 12px icons
- **Sidebar Cart**: Max 280px width, 40px product images
- **Cart Buttons**: 8px padding, 12px font

## Special Considerations

### Landscape Orientation
- **Sidebar Cart**: 100vh height with scroll
- **Cart Items**: 8px padding, 40px images

### High DPI Displays
- **Product Images**: Optimized rendering with crisp-edges

### Touch Devices
- **Minimum Touch Targets**: 44px for all interactive elements
- **Quantity Buttons**: 44px min-height/width
- **Wishlist/Quickview**: 44px min-height/width
- **Cart Buttons**: 44px min-height

### Accessibility Features
- **Keyboard Navigation**: Tab support for quantity buttons
- **Focus Indicators**: 2px blue outline with 2px offset
- **ARIA Labels**: Proper labeling for screen readers
- **Role Attributes**: Button roles for interactive elements

## Component-Specific Responsive Features

### Quantity Selector
- **Container**: Flexbox with gap, background, border, rounded corners
- **Buttons**: Square buttons with hover/active states
- **Input**: Centered text, focus states with blue outline
- **Responsive Scaling**: Buttons and input scale proportionally
- **Touch Optimization**: Minimum 44px touch targets on mobile

### Cart Button
- **Desktop**: Fixed minimum width with hover effects
- **Mobile**: Full width with reduced padding
- **States**: Loading, disabled, "Already in Cart" states
- **Typography**: Responsive font sizes (16px → 12px)
- **Spacing**: Responsive margins and padding

### Wishlist Button
- **Circular Design**: Consistent across all sizes
- **Icon Scaling**: Icons scale with button size
- **States**: Active, hover, disabled states
- **Animation**: Heart beat animation for filled state

### Sidebar Cart
- **Width Scaling**: 400px → 280px across breakpoints
- **Product Images**: 70px → 40px scaling
- **Typography**: Responsive font sizes for all text
- **Layout**: Flexible content area with scroll
- **Buttons**: Stack vertically on smaller screens

### Cart Table
- **Font Scaling**: 16px → 12px across breakpoints
- **Padding**: Responsive cell padding
- **Total Price**: Larger font for emphasis
- **Discount Display**: Color-coded discount amounts

## CSS Classes Reference

### Quantity Selector
```css
.qty-plus-minus          /* Main container */
.qty-btn                 /* Button elements */
.qty-decrease           /* Decrease button */
.qty-increase           /* Increase button */
.qty-input              /* Quantity input field */
```

### Cart Components
```css
.gi-single-cart         /* Cart button container */
.gi-side-cart          /* Sidebar cart container */
.gi-cart-pro-items     /* Cart items list */
.cart-table            /* Cart summary table */
.cart_btn              /* Cart action buttons */
```

### Wishlist Components
```css
.gi-btn-group.wishlist /* Wishlist button */
.gi-wishlist-table     /* Wishlist table */
.gi-action             /* Action buttons container */
```

### Responsive Utilities
```css
/* Touch device optimization */
@media (hover: none) and (pointer: coarse)

/* High DPI displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)

/* Landscape orientation */
@media (max-height: 500px) and (orientation: landscape)

/* Print styles */
@media print
```

## Best Practices

### Mobile-First Approach
- Base styles target mobile devices
- Progressive enhancement for larger screens
- Touch-friendly interaction patterns

### Performance
- Optimized images for different screen densities
- Efficient CSS with minimal redundancy
- Smooth animations and transitions

### Accessibility
- Keyboard navigation support
- Screen reader compatibility
- High contrast ratios
- Adequate touch targets

### User Experience
- Consistent interaction patterns
- Clear visual feedback
- Intuitive layout changes
- Smooth transitions between breakpoints

## Testing Checklist

### Device Testing
- [ ] iPhone SE (375px)
- [ ] iPhone 12/13 (390px)
- [ ] iPhone 12/13 Pro Max (428px)
- [ ] iPad (768px)
- [ ] iPad Pro (1024px)
- [ ] Desktop (1200px+)

### Interaction Testing
- [ ] Touch interactions on mobile
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Focus management
- [ ] Loading states

### Visual Testing
- [ ] High DPI displays
- [ ] Landscape orientation
- [ ] Print styles
- [ ] Dark/light mode compatibility
- [ ] Animation performance

## Maintenance Notes

### Adding New Components
1. Follow the established breakpoint system
2. Include touch device optimizations
3. Add keyboard navigation support
4. Test across all device sizes
5. Update this documentation

### CSS Organization
- Group styles by component
- Use consistent naming conventions
- Include responsive variants together
- Add comments for complex logic

### Performance Considerations
- Minimize CSS file size
- Use efficient selectors
- Avoid layout thrashing
- Optimize animations 