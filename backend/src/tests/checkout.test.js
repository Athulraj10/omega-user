const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index'); // Adjust path as needed
const { User, Product, Cart, Order } = require('../models');

describe('Checkout API Tests', () => {
  let testUser, testProduct, testCart, authToken;

  beforeAll(async () => {
    // Create test user
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      phone: '1234567890'
    });

    // Create test product
    testProduct = await Product.create({
      name: 'Test Product',
      price: 29.99,
      discountPrice: 24.99,
      stock: 10,
      status: '1',
      images: ['test-image.jpg'],
      sku: 'TEST123',
      brand: 'Test Brand'
    });

    // Create test cart
    testCart = await Cart.create({
      userId: testUser._id,
      items: [{
        product: testProduct._id,
        quantity: 2,
        productName: testProduct.name,
        productPrice: testProduct.price,
        productDiscountPrice: testProduct.discountPrice,
        unitPrice: testProduct.discountPrice,
        totalPrice: testProduct.discountPrice * 2,
        isAvailable: true,
        stockAvailable: testProduct.stock
      }],
      subtotal: testProduct.discountPrice * 2,
      totalItems: 2,
      isActive: true
    });

    // Get auth token (you'll need to implement login endpoint)
    // authToken = await getAuthToken(testUser);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});
    await Order.deleteMany({});
    await mongoose.connection.close();
  });

  describe('GET /api/orders/checkout/summary', () => {
    it('should return checkout summary for user cart', async () => {
      const response = await request(app)
        .get('/api/orders/checkout/summary')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.status).toBe(true);
      expect(response.body.data.items).toHaveLength(1);
      expect(response.body.data.subtotal).toBe(49.98); // 24.99 * 2
      expect(response.body.data.totalItems).toBe(2);
    });

    it('should return error for empty cart', async () => {
      // Clear cart first
      await Cart.findByIdAndUpdate(testCart._id, { items: [], subtotal: 0, totalItems: 0 });

      const response = await request(app)
        .get('/api/orders/checkout/summary')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body.status).toBe(false);
      expect(response.body.message).toBe('Cart is empty');
    });
  });

  describe('POST /api/orders/checkout/complete', () => {
    it('should complete checkout and create order', async () => {
      const checkoutData = {
        shippingAddress: {
          label: 'Home',
          addressLine1: '123 Test Street',
          city: 'Test City',
          state: 'Test State',
          postalCode: '12345',
          country: 'Test Country',
          phone: '1234567890'
        },
        paymentMethod: 'cod'
      };

      const response = await request(app)
        .post('/api/orders/checkout/complete')
        .set('Authorization', `Bearer ${authToken}`)
        .send(checkoutData)
        .expect(201);

      expect(response.body.status).toBe(true);
      expect(response.body.data.order).toBeDefined();
      expect(response.body.data.order.status).toBe('pending');
      expect(response.body.data.order.paymentStatus).toBe('pending');
      expect(response.body.data.order.totalAmount).toBe(49.98);
    });

    it('should validate shipping address', async () => {
      const invalidCheckoutData = {
        shippingAddress: {
          label: 'Home',
          // Missing required fields
        },
        paymentMethod: 'cod'
      };

      const response = await request(app)
        .post('/api/orders/checkout/complete')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidCheckoutData)
        .expect(400);

      expect(response.body.status).toBe(false);
      expect(response.body.message).toContain('shipping address');
    });

    it('should handle insufficient stock', async () => {
      // Update product to have insufficient stock
      await Product.findByIdAndUpdate(testProduct._id, { stock: 1 });

      const checkoutData = {
        shippingAddress: {
          label: 'Home',
          addressLine1: '123 Test Street',
          city: 'Test City',
          state: 'Test State',
          postalCode: '12345',
          country: 'Test Country',
          phone: '1234567890'
        },
        paymentMethod: 'cod'
      };

      const response = await request(app)
        .post('/api/orders/checkout/complete')
        .set('Authorization', `Bearer ${authToken}`)
        .send(checkoutData)
        .expect(400);

      expect(response.body.status).toBe(false);
      expect(response.body.message).toContain('Insufficient stock');
    });
  });

  describe('GET /api/orders', () => {
    it('should return user orders', async () => {
      const response = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.status).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/orders/:id', () => {
    it('should return specific order details', async () => {
      // First create an order
      const order = await Order.create({
        user: testUser._id,
        items: [{
          product: testProduct._id,
          quantity: 1,
          priceAtPurchase: testProduct.discountPrice
        }],
        shippingAddress: {
          label: 'Home',
          addressLine1: '123 Test Street',
          city: 'Test City',
          postalCode: '12345',
          country: 'Test Country'
        },
        totalAmount: testProduct.discountPrice,
        originalAmount: testProduct.discountPrice
      });

      const response = await request(app)
        .get(`/api/orders/${order._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.status).toBe(true);
      expect(response.body.data._id).toBe(order._id.toString());
    });
  });

  describe('PUT /api/orders/:id/cancel', () => {
    it('should cancel pending order', async () => {
      const order = await Order.create({
        user: testUser._id,
        items: [{
          product: testProduct._id,
          quantity: 1,
          priceAtPurchase: testProduct.discountPrice
        }],
        shippingAddress: {
          label: 'Home',
          addressLine1: '123 Test Street',
          city: 'Test City',
          postalCode: '12345',
          country: 'Test Country'
        },
        totalAmount: testProduct.discountPrice,
        originalAmount: testProduct.discountPrice,
        status: 'pending'
      });

      const response = await request(app)
        .put(`/api/orders/${order._id}/cancel`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.status).toBe(true);
      expect(response.body.data.status).toBe('cancelled');
    });

    it('should not cancel delivered order', async () => {
      const order = await Order.create({
        user: testUser._id,
        items: [{
          product: testProduct._id,
          quantity: 1,
          priceAtPurchase: testProduct.discountPrice
        }],
        shippingAddress: {
          label: 'Home',
          addressLine1: '123 Test Street',
          city: 'Test City',
          postalCode: '12345',
          country: 'Test Country'
        },
        totalAmount: testProduct.discountPrice,
        originalAmount: testProduct.discountPrice,
        status: 'delivered'
      });

      const response = await request(app)
        .put(`/api/orders/${order._id}/cancel`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body.status).toBe(false);
      expect(response.body.message).toContain('cannot be cancelled');
    });
  });
}); 