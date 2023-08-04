const { Router } = require("express");

const IngredientsController = require("../controllers/IngredientsController");

const ingredientsController = new IngredientsController()
ingredientsRoutes = Router();

ingredientsRoutes.get("/", ingredientsController.index);

module.exports = ingredientsRoutes;