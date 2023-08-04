const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");

const FoodController = require("../controllers/FoodController");
const FoodAvatarController = require("../controllers/FoodAvatarController");

const foodRoutes = Router();
const upload = multer(uploadConfig.MULTER);

const foodController = new FoodController();
const foodAvatarController = new FoodAvatarController();


foodRoutes.post("/", upload.single("avatarFood"), foodController.create);
foodRoutes.patch("/avatar/:id", upload.single("avatarFood"), foodAvatarController.update);

module.exports = foodRoutes;