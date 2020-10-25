const jsonfile = require("jsonfile");

const languagesJsonFilePath = "Data/languages.json";

exports.getLanguages = () => {
    return new Promise((resolve, reject) => {
        jsonfile.readFile(languagesJsonFilePath, function (err, data) {
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


