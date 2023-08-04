const path = require("path");
const multer = require("multer");
const crypto = require("crypto");

// criando um arquivo temporário

const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp");
const UPLOAD_FOLDER = path.resolve(TMP_FOLDER, "uploads");

// manipulando os arquivos com multer

const MULTER = {
    storage: multer.diskStorage({
        destination: TMP_FOLDER, // onde vai ser salvo temporário
        filename(request, file, callback){
            const fileHash = crypto.randomBytes(10).toString('hex');
            const fileName = `${fileHash}-${file.originalname}`;

            // retorno de callback do arquivo sendo passado para um arquivo hash
            return callback(null, fileName);
        },
}),
};

module.exports = {
    TMP_FOLDER,
    UPLOAD_FOLDER,
    MULTER,
}