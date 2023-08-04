const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

const diskStorage = new DiskStorage();
class FoodController {

    async create(request, response){
        const {title, description, price, category, ingredients} = request.body;
        
        const { filename: avatarFood } = request.file;

        const filename = await diskStorage.saveFile(avatarFood);

        const [food_id] = await knex("foods").insert({
            title,
            description,
            price,
            category,
            avatarFood: filename,
        });

        const ingredientsArray = ingredients.split(',');

        const ingredientsInsert = ingredientsArray.map(ingredient => {
            food_id,
            ingredient
        });

        await knex("ingredients").insert(ingredientsInsert).groupBy(food_id).orderBy("name"); 

        // Inserindo dentro da tabela ingredientes todas as condições
       
        return response.status(201).json("Prato adicionado!");
    }

    async show(request, response){
        const { id } = request.params;

        const food = await knex("foods").where({id}).first();
        const ingredients = await knex("ingredients").where({food_id: id}).orderBy("name");

        return response.json({
            ...food,
            ingredients
        });
    }

    async update(request, response){
        const {title, description, price, category, ingredients} = request.body;
        const { id } = request.params;

        const { filename: imageFilename } = request.file;

        const food = await knex("foods").where({id}).first();
        
        if (food.avatarFood){
            await diskStorage.deleteFile(food.avatarFood);
        }

        const filename = await diskStorage.saveFile(imageFilename);

        food.avatarFood = filename;
        food.title = title ?? food.title;
        food.description = description ?? food.description;
        food.category = category ?? food.category;
        food.price = price ?? food.price;

        await knex("foods").where({ id }).update(food);
        await knex("foods").where({ id }).update('updated_at', knex.fn.now());

        const ingredientsArray = ingredients.split(',');

        const ingredientsInsert = ingredientsArray.map(ingredient => {
            food_id,
            ingredient
        });

        await knex("ingredients").where({food_id: id}).delete();
        await knex("ingredients").where({food_id: id}).insert(ingredientsInsert);

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