var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');

const common = require('../Model/common');
const loginBl = require('../Model/loginBl');


router.get('/', function (req, res, next) {
  let appSession = req.session;
  res.render('menuPage', { isAdmin: appSession.isAdmin });
});

router.get('/menuPage', function (req, res, next) {
  let appSession = req.session;
  res.render('menuPage', { isAdmin: appSession.isAdmin });
});

router.get('/search', function (req, res, next) {
  let appSession = req.session;
  if (appSession.isAuthenticated) {
    let resultsData = common.checkIfUserCanLogIn(appSession.date, appSession.numOfTranctions, appSession.currentNumOfTranctions)
    if (resultsData.userCanLogIn) {
      appSession.numOfTranctions += 1;
      res.render('movies/searchMovie', {});
    } else {
      appSession.numOfTranctions = 0;
      appSession.date = common.getDateNowAsString();
      res.redirect('/login');
    }
  }
  else {
    res.redirect('/login');
  }
});

router.post('/searchResults', [body('name').not().isEmpty()],
  async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', "Please fill movie name.");
      res.locals.message = req.flash();
      res.render('movies/searchMovie', { message: res.locals.message })
    }
    else {
      let appSession = req.session;
      if (appSession.isAuthenticated) {
        let resultsData = common.checkIfUserCanLogIn(appSession.date, appSession.numOfTranctions, appSession.currentNumOfTranctions)
        if (resultsData.userCanLogIn) {
          let results = await loginBl.filterSearchResults(req.body);
          if (results.isSuccess) {
             appSession.numOfTranctions += 1;
            res.render('movies/searchResults',
              {
                filterMoviesByFullSearch: results.filterMoviesByFullSearch,
                filterMoviesByGenres: results.filterMoviesByGenres
              });
          }
          else {
            req.flash('error', "Error in getting search results");
            res.locals.message = req.flash();
            res.render('movies/searchResults', { 
                message: res.locals.message })
          }
        } else {
          appSession.numOfTranctions = 0;
          appSession.date = common.getDateNowAsString();
          res.redirect('/login');
        }
      }
      else {
        res.redirect('/login');
      }

    }
  });

router.get('/create', async function (req, res, next) {
  let appSession = req.session;
  if (appSession.isAuthenticated) {
    let resultsData = common.checkIfUserCanLogIn(appSession.date, appSession.numOfTranctions, appSession.currentNumOfTranctions)
    if (resultsData.userCanLogIn) {
      appSession.numOfTranctions += 1;
      let results1 = await loginBl.getLanguages();
      let results2 = await loginBl.getGenres();
      if (results1.isSuccess && results2.isSuccess) {
        appSession.languages = results1.languages;
        appSession.genres = results2.genres;
        res.render('movies/createMovie', { languages: results1.languages, genres: results2.genres });
      }
      else {
        req.flash('error', "Failed to prepare create form.");
        res.locals.message = req.flash();
        res.render('movies/createMovie', { message: res.locals.message })
      }
    } else {
      appSession.numOfTranctions = 0;
      appSession.date = common.getDateNowAsString();
      res.redirect('/login');
    }
  }
  else {
    res.redirect('/login');
  }
});

router.post('/create', [body('name').not().isEmpty(), body('genres').not().isEmpty()],
  async function (req, res) {
    const errors = validationResult(req);
    let appSession = req.session;
    if (!errors.isEmpty()) {
      req.flash('error', "Please fill all new movie details.");
      res.locals.message = req.flash();
      res.render('movies/createMovie', {
        languages: appSession.languages,
        genres: appSession.genres,
        message: res.locals.message,
      })
    }
    else {
      let appSession = req.session;
      if (appSession.isAuthenticated) {
        let resultsData = common.checkIfUserCanLogIn(appSession.date, appSession.numOfTranctions, appSession.currentNumOfTranctions)
        if (resultsData.userCanLogIn) {
          let results = await loginBl.addMovieToFile(req.body);
          if (results.isSuccess) {
            appSession.numOfTranctions += 1;
            res.redirect('/movies/menuPage');
          }
          else {
            req.flash('error', "Failed to write new movie to file.");
            res.locals.message = req.flash();
            res.render('movies/createMovie', {
                 message: res.locals.message
            })
          }
        } else {
          appSession.numOfTranctions = 0;
          appSession.date = common.getDateNowAsString();
          res.redirect('/login');
        }
      }
      else {
        res.redirect('/login');
      }

    }
  });

  router.get('/movieDataPage', async function (req, res, next) {
    let movieId = req.query.movieId;
    let appSession = req.session;
    if (appSession.isAuthenticated) {
      let resultsData = common.checkIfUserCanLogIn(appSession.date, appSession.numOfTranctions, appSession.currentNumOfTranctions)
      if (resultsData.userCanLogIn) {
        let results = await loginBl.getMovieData(movieId);
          if (results.isSuccess) {
             appSession.numOfTranctions += 1;
             res.render('movies/movieDataPage', {movieData:results.filteredMovie});
          }
          else{
            req.flash('error', "Failed to bring data of movie.");
            res.locals.message = req.flash();
            res.render('movies/searchResults', {
                 message: res.locals.message
            })
          }
      } else {
        appSession.numOfTranctions = 0;
        appSession.date = common.getDateNowAsString();
        res.redirect('/login');
      }
    }
    else {
      res.redirect('/login');
    }
  });
module.exports = router;
