const { userTokenAuth } = require("../../middlewares/user")
const CartController = require("../../controllers/app/cartController")

const router = require("express").Router()

router.use(userTokenAuth)

router.get("/", CartController.getCart)

router.post("/add", CartController.addToCart)

router.put("/update/:productId", CartController.updateQuantity)

router.delete("/remove/:productId", CartController.removeFromCart)

router.delete("/clear", CartController.clearCart)

module.exports = router
