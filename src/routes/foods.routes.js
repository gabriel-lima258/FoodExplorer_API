const { Router } = require("express");

const multer = require("multer"); //importando o multer
const uploadConfig = require("../configs/upload"); // importando minhas configurações de upload, arquivo upload.js na pasta de configurações

const FoodController = require("../controllers/FoodController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const foodRoutes = Router();
const upload = multer(uploadConfig.MULTER);

const foodController = new FoodController();

foodRoutes.use(ensureAuthenticated);

foodRoutes.post("/", upload.single("avatarFood"), foodController.create);
foodRoutes.get("/", foodController.index);
foodRoutes.get("/:id", foodController.show);
foodRoutes.put("/:id", upload.single("avatarFood"), foodController.update);
foodRoutes.delete("/:id", foodController.delete);



module.exports = foodRoutes;