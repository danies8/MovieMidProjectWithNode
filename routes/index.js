var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');

const loginBl = require('../Model/loginBl');
const common = require('../Model/common');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index/index', {});
});

router.get('/login', function (req, res, next) {
  res.render('index/index', {});
});

router.post('/login', [body('userName').not().isEmpty(), body('password').not().isEmpty()],
  async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', "Please fill user name and password.");
      res.locals.message = req.flash();
      res.render('index/index', { message: res.locals.message })
    }
    else {
      let appSession = req.session;
      let results = await loginBl.isValidUser({ userName: req.body.userName, password: req.body.password });
      if (results.isSuccess) {
        let resultsData = common.checkIfUserCanLogIn(appSession.date, appSession.numOfTranctions, results.numOfTranctions)
        if (resultsData.userCanLogIn) {
          appSession.numOfTranctions += 1;
          appSession.isAdmin = results.isAdmin;
          res.render('menuPage', { isAdmin: results.isAdmin })
        }
        else if(appSession.numOfTranctions == undefined){
          appSession.numOfTranctions = 1
          appSession.date = common.getDateNowAsString();
          appSession.currentNumOfTranctions = results.numOfTranctions;
          appSession.isAdmin = results.isAdmin;
          appSession.isAuthenticated = true;
          res.render('menuPage', { isAdmin: results.isAdmin })
        }
        else{
          appSession.numOfTranctions = 0;
          appSession.date = common.getDateNowAsString();
          res.redirect('/login');
        }
      }
      else {
        req.flash('error', "User name or password are invalid.");
        res.locals.message = req.flash();
        res.render('index/index', { message: res.locals.message })
      }
    }
  });
module.exports = router;
