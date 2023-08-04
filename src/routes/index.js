const { Router } = require('express');

const userRouter = require('./users.routes');
const foodRouter = require('./foods.routes');
const ingredientsRouter = require('./ingredients.routes');

const routes = Router();

routes.use("/users", userRouter);
routes.use("/foods", foodRouter);
routes.use("/ingredients", ingredientsRouter);

module.exports = routes;