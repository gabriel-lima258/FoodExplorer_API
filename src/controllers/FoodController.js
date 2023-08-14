const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

const diskStorage = new DiskStorage();
class FoodController {

    async create(request, response){
        const {title, description, price, category, ingredients} = request.body;

        const ifFoodExists = await knex("foods").where({title}).first();

        if(ifFoodExists){
            throw new AppError("Esta comida já existe!", 401);
        }

        const foodFilename = request.file.filename;
        const filename = await diskStorage.saveFile(foodFilename);

        const [food_id] = await knex("foods").insert({
            avatarFood: filename,
            title,
            description,
            price,
            category
        });

        const hasOnlyOneIngredient = typeof(ingredients) === "string";

        let ingredientsInsert

        if (hasOnlyOneIngredient) {
        ingredientsInsert = {
            name: ingredients,
            food_id
        }

        } else if (ingredients.length > 1) {
        ingredientsInsert = ingredients.map(ingredient => {
            return {
            name : ingredient,
            food_id
            }
        });

        } else {
        return 
        }
        
            await knex("ingredients").insert(ingredientsInsert); 

            // Inserindo dentro da tabela ingredientes todas as condições
        
            return response.status(201).json("Prato adicionado!");
    }

    async index(request, response){
        const { title, ingredients } = request.query;

        let foods;

        if (ingredients){

            const filterIngredients = ingredients.split(',').map(ingredient => ingredient.thim());

            foods = await knex("ingredients")
            .select([
            "foods.id",
            "foods.title",
            "foods.description",
            "foods.category",
            "foods.price",
            "foods.avatarFood",
            ])
            .whereLike("foods.title", `%${title}`)
            .whereIn("name", filterIngredients)
            .innerJoin("foods", "foods.id", "ingredients.food_id")
            .groupBy("foods.id")
            .orderBy("foods.title")
        } else {
            foods = await knex("foods")
            .whereLike("title", `%${title}`)
            .orderBy("title")
        }

        const foodsIngredients = await knex("ingredients");
        const foodsWithIngredients = foods.map(food => {
            
            const foodIngredient = foodsIngredients.filter(ingredient => ingredient.food_id === food.id);

            return {
                ...food,
                ingredients: foodIngredient
            }
        })

        return response.status(201).json(foodsWithIngredients);
    }

    async update(request, response){
        const {title, description, price, category, ingredients} = request.body;
        const { id } = request.params;

        const food = await knex("foods").where({id}).first();

        if(!food){
            throw new AppError("Prato não existe!", 401);
        }
 
        food.title = title ?? food.title;
        food.description = description ?? food.description;
        food.category = category ?? food.category;
        food.price = price ?? food.price;

        await knex("foods").where({ id }).update(food);
        await knex("foods").where({ id }).update('updated_at', knex.fn.now());

        const hasOnlyOneIngredient = typeof(ingredients) === "string";

        let ingredientsInsert;

        if (hasOnlyOneIngredient) {
        ingredientsInsert = {
            name: ingredients,
            food_id: food.id
        }

        } else if (ingredients.length > 1) {
        ingredientsInsert = ingredients.map(ingredient => {
            return {
            name : ingredient,
            food_id: food.id
            }
        });

        } else {
        return 
        }

        await knex("ingredients").where({food_id: id}).delete()
        await knex("ingredients").where({food_id: id}).insert(ingredientsInsert)
        
        return response.status(201).json("Prato atualizado!");
    }

    async delete(request, response){
        const { id } = request.params;

        await knex("foods").where({id}).delete();

        return response.status(201).json("Prato deletado!");
    }

    async show(request, response){
        const { id } = request.params;

        const food = await knex("foods").where({id}).first();
        const ingredients = await knex("ingredients").where({food_id: id}).orderBy("name");

        return response.status(201).json({
            ...food,
            ingredients
        });
    }
}

module.exports = FoodController;