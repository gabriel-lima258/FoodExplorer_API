require("express-async-errors");
require("dotenv/config");

const AppError = require('./utils/AppError');

const routes = require("./routes");

const uploadConfig = require('./configs/upload');

const migrationRun = require('./database/sqlite');

const express = require("express");

const cors = require("cors");

migrationRun();

const app = express();

app.use("/files", express.static(uploadConfig.UPLOAD_FOLDER)); // buscando pelo que está dentro da pasta de uploads, na rota /files busco isso através do método static do express

app.use(cors()); // para que o backend se integre com o frontend

app.use(express.json()); // colocando o express para usar json()

app.use(routes);

app.use(( error, request, response, next ) => { //Capturando o erro, a requisição, a resposta e o next(precisa ser nessa ordem)

    //verificando se o o erro é do mesmo tipo do app error, que eu sei qual é pois eu quem fiz, lado do cliente feito lá na pasta utils
    if (error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        });
    }

    console.error(error); //para conseguir debugar o erro, caso eu precise.

    return response.status(500).json({
        status: "error",
        message: "Internal server error"
    });
    
})


const PORT = process.env.PORT || 3333;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));