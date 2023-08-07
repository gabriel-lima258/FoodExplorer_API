const {Router} = require('express');

const OrderController = require('../controllers/OrderController');
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const orderRoutes = Router();

const orderController = new OrderController();

orderRoutes.use(ensureAuthenticated)

orderRoutes.post("/", orderController.create);
orderRoutes.get("/:id", orderController.show);
orderRoutes.get("/", orderController.index);
orderRoutes.delete("/:id", orderController.delete);
orderRoutes.put("/", orderController.update);

module.exports = orderRoutes;