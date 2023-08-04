const { hash, compare } = require("bcryptjs");
const knex = require("../database/knex");

const AppError = require("../utils/AppError");

class UsersController {

    async create(request, response) {
        const { name, email, password } = request.body;

        const checkUserExists = await knex("users").where({email}).first();
    
        if(checkUserExists){
            throw new AppError("O e-mail já está em uso!", 401);
        }

        const hashedPassword = await hash(password, 8);

        await knex("users").insert({
            name,
            email,
            password: hashedPassword,
        });
    
        return response.status(201).json("Usuário cadastrado!");
    }

    async update(request, response) {
        const {name, email, password, old_password} = request.body;
        const {id} = request.params;

        const user = await knex("users").where({id}).first();

        if (!user) {
            throw new AppError("Usuário não encontrado!", 401);
        }

        const userWithUpdateEmail = await knex("users").where({email}).first();

        if (userWithUpdateEmail && userWithUpdateEmail.id !== user.id){
            throw new AppError("Este email já está em uso!");
        }

        user.name = name ?? user.name; // ?? - se existir valor name no argumento anterior vai ser mantido
        user.email = email ?? user.email;

        if (password && !old_password) {
            throw new AppError("Você precisa informar a senha antiga para definir a nova senha!");
        }

        if (password && old_password) {
            const checkOldPassword = await compare(old_password, user.password);

            if(!checkOldPassword) {
                throw new AppError("A senha antiga não confere!");
            }

            user.password = await hash(password, 8);
        }

        await knex("users").where({id}).update({
            name: user.name,
            email: user.email,
            password: user.password, 
        })

        return response.json("Usuário atualizado!");
    }

}

module.exports = UsersController