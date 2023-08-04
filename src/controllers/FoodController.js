const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../utils/DiskStorage");

class FoodController {

    async create(request, response){
        const {title, description, price, category, ingredients} = request.body;

        const checkFoodExists = await knex("foods").where({title}).first();

        if(checkFoodExists){
            throw new AppError("Esta comida já existe!", 401);
        }

       const foodFilename = request.file.filename;
       const diskStorage = new DiskStorage();
       
       const filename = await diskStorage.saveFile(foodFilename);

       const [food_id] = await knex("foods").insert({
            avatarFood: filename,
            title,
            description,
            price,
            category
       });

       const hasOnlyOneIngredient = typeof(ingredients) === "string";

       let ingredientsInsert;

       if(hasOnlyOneIngredient){
        ingredientsInsert = {
            name: ingredients,
            food_id
        }

       } else if (ingredients.length > 1) {
        ingredientsInsert = ingredients.map(ingredients => {
            return {
                name: ingredients,
                food_id
            }
        })

       } else {
            return;
       }

       await knex("ingredients").insert(ingredientsInsert);

       return response.status(201).json("Prato adicionado!");
    }
}

module.exports = FoodController;