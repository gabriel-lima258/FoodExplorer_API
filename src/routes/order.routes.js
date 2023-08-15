const {Router} = require('express');

const OrderController = require('../controllers/OrderController');
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const orderRoutes = Router();

const orderController = new OrderController();

orderRoutes.use(ensureAuthenticated)

orderRoutes.post("/", orderController.create);
orderRoutes.get("/", orderController.index);
orderRoutes.put("/", orderController.update);

module.exports = orderRoutes;