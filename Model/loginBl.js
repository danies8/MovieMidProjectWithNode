const userDal = require('../Dal/usersDal');
const movieDal = require('../Dal/moviesDal');
const movieApiDal = require('../Dal/moviesApiDal');
const languageDal = require('../Dal/languagesDal');
const genreDal = require('../Dal/genresDal');


exports.isValidUser = async function (userObj) {
    try {
        let usersData = await userDal.readUsersFromFile();
        let users = usersData.users;
        let usersFiltered = users.filter(user => user.userName == userObj.userName && user.password == userObj.password);
        if (usersFiltered.length > 0) {
            let isAdmin = usersFiltered[0].userName === "admin" && usersFiltered[0].password === "ytghjuyt";
            return { isSuccess: true, isAdmin: isAdmin, isAuthenticated: true, numOfTranctions: { numOfTranctions: usersFiltered[0].numOfTranctions } };
        }
        else {
            return { isSuccess: false, isAdmin: false, isAuthenticated: false };
        }
    }
    catch (e) {
        return { isSucess: false, errorMessage: e.message };
    }
}

exports.addMovieToFile = async function (reqBody) {
    try {

        let resp = await movieDal.readMoviesFromFile();
        let movies = resp.movies;

        let maxMovieId = 2400;
        movies.forEach(movie => {
            if (movie.id > maxMovieId) {
                maxMovieId = movie.id;
            }
        });

        let newMovie = {};
        newMovie.id = maxMovieId + 1;
        newMovie.name = reqBody.name;
        newMovie.language = reqBody.language;
        if (typeof reqBody.genres === "string") {
            let genresArr = [];
            genresArr.push(reqBody.genres);
            newMovie.genres = genresArr;
        } else {
            newMovie.genres = reqBody.genres;
        }

        movies.push(newMovie);
        let newMovieObj = {};
        newMovieObj.movies = movies;
        let results = await movieDal.writeMoviesToFile(newMovieObj);
        if (results == "Success") {
            return { isSuccess: true };
        }
        else {
            return { isSuccess: true };
        }
    }
    catch (e) {
        return { isSucess: false, errorMessage: e.message };
    }

}

exports.filterSearchResults = async function (reqBody) {
    try {
        // Source: file
        let resp = await movieDal.readMoviesFromFile();
        let movies = resp.movies;

        // Source: api
        let resMoviesApi = await movieApiDal.getAllMoviesFromApi();
        let moviesApiData = resMoviesApi.data;

        // Filter file by serach requirements
        let filterMovies1 = movies.filter(movie =>
            movie.name.toLowerCase() === reqBody.name.toLowerCase() &&
            movie.language.toLowerCase() === reqBody.language.toLowerCase() &&
            movie.genres.map(genre => genre.toLowerCase()).includes(reqBody.genres.toLowerCase()));

        // Filter api by serach requirements
        let filterApiMovies1 = moviesApiData.filter(movieApiData =>
            movieApiData.name.toLowerCase() === reqBody.name.toLowerCase() &&
            movieApiData.language.toLowerCase() === reqBody.language.toLowerCase() &&
            movieApiData.genres.map(genre => genre.toLowerCase()).includes(reqBody.genres.toLowerCase()));

        // Merege file and api by serach requirements
        let targetFilterMovies1 = [];
        targetFilterMovies1 = filterMovies1.concat(filterApiMovies1);

        // Filter file by genres of current movie   
        let filterMovies2 = movies.filter(movie => movie.genres.map(genre => genre.toLowerCase()).includes(reqBody.genres.toLowerCase()));

        // Filter api by genres of current movie   
        let filterApiMovies2 = moviesApiData.filter(movieApiData => movieApiData.genres.map(genre => genre.toLowerCase()).includes(reqBody.genres.toLowerCase()));

        // Merege file and api by serach requirements
        let targetFilterMovies2 = [];
        targetFilterMovies2 = filterMovies2.concat(filterApiMovies2);

        return { isSuccess: true, filterMoviesByFullSearch: targetFilterMovies1, filterMoviesByGenres: targetFilterMovies2 }
    }
    catch (e) {
        return { isSucess: false, errorMessage: e.message };
    }
}

exports.getLanguages = async function () {
    try {
        let languagesData = await languageDal.getLanguages();
        let languages = languagesData.languages;
        return { isSuccess: true, languages: languages };

    }
    catch (e) {
        return { isSucess: false, errorMessage: e.message };
    }
}

exports.getGenres = async function () {

    try {
        let genresData = await genreDal.getGenres();
        let genres = genresData.genres;
        return { isSuccess: true, genres: genres };

    }
    catch (e) {
        return { isSucess: false, errorMessage: e.message };
    }
}

exports.getMovieData = async function (movieId) {
    try {
        let resp = await movieDal.readMoviesFromFile();
        let movies = resp.movies;

        let resMoviesApi = await movieApiDal.getAllMoviesFromApi();
        let moviesApiData = resMoviesApi.data;
   
        if (movies.length > 0) {
            let filteredMovies = movies.filter(movie => movie.id == movieId);
            if (filteredMovies.length > 0) {
                return { isSuccess: true, filteredMovie: filteredMovies[0] };
            }
            else {
                let filteredMoviesApiData = moviesApiData.filter(movieApiData => movieApiData.id == movieId);
                if (filteredMoviesApiData.length > 0) {
                    return { isSuccess: true, filteredMovie: filteredMoviesApiData[0] };
                }
            }
        }
        else {
            let filteredMoviesApiData = moviesApiData.filter(movieApiData => movieApiData.id == movieId);
            if (filteredMoviesApiData.length > 0) {
                return { isSuccess: true, filteredMovie: filteredMoviesApiData[0] };
            }
        }

    }

    catch (e) {
        return { isSucess: false, errorMessage: e.message };
    }
}

exports.getUsers = async function () {

    try {
        let userData = await userDal.readUsersFromFile();
        let users = userData.users;
        return { isSuccess: true, users: users };

    }
    catch (e) {
        return { isSucess: false, errorMessage: e.message };
    }
}

exports.getUserData = async function (userName) {
    try {

        let resp = await userDal.readUsersFromFile();
        let users = resp.users;
        let filteredUsers = users.filter(user => user.userName === userName);
        if (filteredUsers.length > 0) {
            return { isSuccess: true, userData: filteredUsers[0] };
        }
        else {
            return { isSuccess: false, userData: [] };
        }
    }
    catch (e) {
        return { isSucess: false, errorMessage: e.message };
    }
}



exports.addUser = async function (reqBody) {
    try {

        let resp = await userDal.readUsersFromFile();
        let users = resp.users;

        let usersFiltered = users.filter(user => user.userName === reqBody.userName);
        if (usersFiltered.length > 0) {
            return { isSuccess: false };
        }

        let newUser = {};
        newUser.userName = reqBody.userName;
        newUser.password = reqBody.password;
        newUser.createdDate = reqBody.createdDate;
        newUser.numOfTranctions = reqBody.numOfTranctions;
        users.push(newUser);

        let newUserObj = {};
        newUserObj.users = users;
        let results = await userDal.writeUsersToFile(newUserObj);
        if (results == "Success") {
            return { isSuccess: true };
        }
        else {
            return { isSuccess: false };
        }
    }
    catch (e) {
        return { isSucess: false, errorMessage: e.message };
    }
}


exports.updateUser = async function (reqBody) {
    try {

        let resp = await userDal.readUsersFromFile();
        let users = resp.users;
        users.forEach((user, index) => {
            if (user.userName === reqBody.userName) {
                users.splice(index, 1);
            }
        });


        let newUser = {};
        newUser.userName = reqBody.userName;
        newUser.password = reqBody.password;
        newUser.createdDate = reqBody.createdDate;
        newUser.numOfTranctions = reqBody.numOfTranctions;
        users.push(newUser);

        let newUserObj = {};
        newUserObj.users = users;
        let results = await userDal.writeUsersToFile(newUserObj);
        if (results == "Success") {
            return { isSuccess: true };
        }
        else {
            return { isSuccess: false };
        }
    }
    catch (e) {
        return { isSucess: false, errorMessage: e.message };
    }
}

exports.deleteUser = async function (userName) {
    try {

        let resp = await userDal.readUsersFromFile();
        let users = resp.users;
        users.forEach((user, index) => {
            if (user.userName === userName) {
                users.splice(index, 1);
            }
        });

        let newUserObj = {};
        newUserObj.users = users;
        let results = await userDal.writeUsersToFile(newUserObj);
        if (results == "Success") {
            return { isSuccess: true };
        }
        else {
            return { isSuccess: false };
        }
    }
    catch (e) {
        return { isSucess: false, errorMessage: e.message };
    }
}

