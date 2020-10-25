const jsonfile = require("jsonfile");

const usersJsonFilePath = "Data/users.json";

exports.readUsersFromFile = () => {
    return new Promise((resolve, reject) => {
        jsonfile.readFile(usersJsonFilePath, function (err, data) {
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

exports.writeUsersToFile = (fileContent) => {
    return new Promise((resolve, reject) => {
        jsonfile.writeFile(usersJsonFilePath, fileContent, function (err) {
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

