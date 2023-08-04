const knex = require("../database/knex");

class IngredientsController{
    async index(request, response){
        const {food_id} = request.params;

        const ingredients = await knex("ingredients").where({food_id}).groupBy("name");

        return response.json(ingredients)
    }
}

module.exports = IngredientsController;