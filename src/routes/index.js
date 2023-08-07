const { Router } = require('express');

const userRouter = require('./users.routes');
const foodRouter = require('./foods.routes');
const orderRouter = require('./order.routes');
const sessionsRouter = require('./sessions.routes');

const routes = Router();

routes.use("/users", userRouter);
routes.use("/foods", foodRouter);
routes.use("/orders", orderRouter);
routes.use("/sessions", sessionsRouter);

module.exports = routes;