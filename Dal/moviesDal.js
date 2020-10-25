const jsonfile = require("jsonfile");

const newMovieFilePath = "Data/newMovie.json";

exports.readMoviesFromFile = () => {
    return new Promise((resolve, reject) => {
        jsonfile.readFile(newMovieFilePath, function (err, data) {
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


exports.writeMoviesToFile = (fileContent) => {
    return new Promise((resolve, reject) => {
        jsonfile.writeFile(newMovieFilePath, fileContent, function (err) {
            if (err) {
                 reject(err);
                 return;
              }
            else {
                 resolve("Success");
                
            }
        })
    });
}
