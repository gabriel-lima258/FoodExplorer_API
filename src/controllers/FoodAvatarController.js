const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

class FoodAvatarController {
    async update(request, response) {
        const {id} = request.params; 
        const avatarFilename = request.file.filename;

        const diskStorage = new DiskStorage()

        const food = await knex("foods")
        .where({id}).first(); // where, onde id seja igual um food_id específico

        if(!food) {
            throw new AppError('Essa comida não existe', 401);
        }

        const filename = await diskStorage.saveFile(avatarFilename);
        
        food.avatarFood = filename; // caso não exista salvar a nova foto

        await knex("foods").update(food).where({id}); // atualiza o banco de dados o avatar

        return response.json(food);
    }
}

module.exports = FoodAvatarController;