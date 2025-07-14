const router = require("express").Router();

const authentication = require('./authentication');
const product = require('./products');
const userCart = require('./cart');
const userWishlist = require('./wishlist');
const userOrders = require('./orders');
const banners = require('./banners');

router.use('/v1', authentication)
router.use('/v1/products', product)
router.use('/v1/cart', userCart)
router.use('/v1/wishlist', userWishlist)
router.use('/v1/orders', userOrders)
router.use('/v1/banners', banners)


module.exports = router