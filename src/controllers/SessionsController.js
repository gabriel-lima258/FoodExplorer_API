const knex = require("../database/knex"); //importando minha conexão com meu BD
const AppError = require("../utils/AppError") // importo para tratar os erros e mostrar mensagens para o usuário
const { compare } = require("bcryptjs"); //preciso importar esse método para comparar senhas criptografadas
const authConfig = require("../configs/auth"); //configurações de autenticação da nossa Aplicação, arquivo que criamos o token
const { sign } = require("jsonwebtoken"); //importando o sign, que é um método do json web token, para de fato gerar esse token com conteúdo dentro

class SessionsController{

    async create(request, response){
        const {email, password} = request.body;

        const user = await knex("users").where({email}).first(); //'first' para pegar apenas um email, e trazer os dados do usuário que possui esse email filtrado

        if(!user){
            throw new AppError("E-mail ou senha incorreta", 401);
        }

        const passwordMatched = await compare(password, user.password);

        if(!passwordMatched){
            throw new AppError("E-mail ou senha incorreta", 401);
        }

        const {secret, expiresIn} = authConfig.jwt;
        const token = sign({}, secret, { //criando de fato meu token, insiro objeto vazio, a frase secreta e um objeto com o conteúdo e tempo de expiração
            subject: String(user.id), //colocando meu id como conteúdo do token; usando o parse String() para garantir que será string
            expiresIn //data de expiração já configurada como 1 dia em auth.js que, ao importar, chamei aqui de authConfig
        });

        return response.json({ user, token });
    }
}

module.exports = SessionsController;