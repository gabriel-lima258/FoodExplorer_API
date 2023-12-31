const {verify} = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const authConfig = require('../configs/auth');

function ensureAuthenticated(request, response, next){

    const authHeader = request.headers.authorization;

    if(!authHeader){
        throw new AppError("JWT Token não informado", 401);
    }

    /* 
    Prosseguindo, se o token existir, vamos acessar o header e lá dentro retirar só o número do token.
    Estamos quebrando esse texto (header), transformando em vetor/array, pegando só a segunda posição
    e passando ela para dentro de uma variável chamada token.
    */

    const [, token] = authHeader.split(" ");

    /*
    Tentar:
    1.Com a função verify() consigo obter a propriedade do sub (conteúdo) do resultado,
    isso se o token for válido.
    2.Já apelidar esse conteúdo de user_id.
    3.Pegar a requisição e colocar dentro a propriedade user e dentro desta definir uma propriedade
    id cujo valor será o user_id ('sub' obtido acima) transformado em número.]
    4.Retorna o next para dar seguimento, o middleware já cumpriu sua fiscalização. Parou por aí.
    Se a verificação der errada vai para o catch, pois não vou conseguir tirar o
    sub do resultado da função verify. Daí dará erro. E o catch vai pegar esse erro e tratar.
    */

    try {
        const {sub:user_id} = verify(token, authConfig.jwt.secret);

        request.user = {
            id: Number(user_id),
        };

        return next();
    } catch {
        throw new AppError("JWT Token inválido", 401);
    }
}

module.exports = ensureAuthenticated;