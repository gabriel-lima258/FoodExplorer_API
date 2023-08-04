const knex = require('../database/knex');
const AppError = require('../utils/AppError');
const DiskStorage = require('../utils/DiskStorage');

class FoodAvatarController{

    async update(request, response){
        const { id } = request.params;
        const avatarFilename = request.file.filename;

        const diskStorage = new DiskStorage();

        const food = await knex("foods").where({id}).first();

        if(!food){
            throw new AppError("Esta comida não existe", 401);
        }

        const filename = await diskStorage.saveFile(avatarFilename);

        food.avatarFilename = filename;

        await knex("foods").update(food).where({id});

        return response.json(food);
    }
}

module.exports = FoodAvatarController;