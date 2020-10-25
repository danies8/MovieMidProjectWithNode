const jsonfile = require("jsonfile");

const genresJsonFilePath = "Data/genres.json";

exports.getGenres = () => {
    return new Promise((resolve, reject) => {
        jsonfile.readFile(genresJsonFilePath, function (err, data) {
            if (err) {
                reject(err);
                return;
            }
            else {
                resolve(data);
            }
        })
    });
}


