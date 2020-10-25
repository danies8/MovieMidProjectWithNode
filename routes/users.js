var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');

const common = require('../Model/common');
const loginBl = require('../Model/loginBl');

/* GET users listing. */
router.get('/', function (req, res, next) {
});

router.get('/edit', async function (req, res, next) {
  let appSession = req.session;
  if (appSession.isAuthenticated && appSession.isAdmin) {
    let resultsData = common.checkIfUserCanLogIn(appSession.date, appSession.numOfTranctions, appSession.currentNumOfTranctions)
    if (resultsData.userCanLogIn) {
      let results = await loginBl.getUsers();
      if (results.isSuccess) {
        appSession.numOfTranctions += 1;
        res.render('users/editUser', { users: results.users });
      }
      else {
        req.flash('error', "Failed to prepare user data.");
        res.locals.message = req.flash();
        res.render('menuPage', { message: res.locals.message, isAdmin: appSession.isAdmin })
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

router.get('/editUser', async function (req, res, next) {
  let userName = req.query.userName;
  let appSession = req.session;
  if (appSession.isAuthenticated && appSession.isAdmin) {
    let resultsData = common.checkIfUserCanLogIn(appSession.date, appSession.numOfTranctions, appSession.currentNumOfTranctions)
    if (resultsData.userCanLogIn) {
       if (userName !== "newUser") {
        let results = await loginBl.getUserData(userName);
        if (results.isSuccess) {
          appSession.numOfTranctions += 1;
          res.render('users/userDataPage', { userData: results.userData });
        }
        else {
          req.flash('error', "Failed to prepare edit user from.");
          res.locals.message = req.flash();
          let results = await loginBl.getUsers();
          res.render('users/editUser', { message: res.locals.message, users: results.users })
        }
      }
      else {
        appSession.numOfTranctions += 1;
        res.render('users/userDataPage', {userData:null });
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


router.post('/addUser', [body('userName').not().isEmpty(), body('password').not().isEmpty(),
body('createdDate').not().isEmpty(), body('numOfTranctions').not().isEmpty()],
 async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', "Please fill all user form details.");
    res.locals.message = req.flash();
    // let userData = {};
    // userData.userName = req.body.userName;
    // userData.password = req.body.password;
    // userData.createdDate = req.body.createdDate;
    // userData.numOfTranctions = req.body.numOfTranctions;
    res.render('users/userDataPage', { message: res.locals.message , userData:null})
  }
  else {
    let appSession = req.session;
    if (appSession.isAuthenticated && appSession.isAdmin) {
      let resultsData = common.checkIfUserCanLogIn(appSession.date, appSession.numOfTranctions, appSession.currentNumOfTranctions)
      if (resultsData.userCanLogIn) {
        let results1 = await loginBl.addUser(req.body);
        let results2 = await loginBl.getUsers();
        if (results1.isSuccess && results2.isSuccess) {
          appSession.numOfTranctions += 1;
          res.render('users/editUser', { users: results2.users });
        }
        else {
          req.flash('error', "Failed to save user to file, your user name already exists.");
          res.locals.message = req.flash();
          // let userData = {};
          // userData.userName = req.body.userName;
          // userData.password = req.body.password;
          // userData.createdDate = req.body.createdDate;
          // userData.numOfTranctions = req.body.numOfTranctions;
          res.render('users/userDataPage', { message: res.locals.message,  userData:null })
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


router.post('/editUser', [body('userName').not().isEmpty(), body('password').not().isEmpty(),
body('createdDate').not().isEmpty(), body('numOfTranctions').not().isEmpty()],
 async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', "Please fill all user form details.");
    res.locals.message = req.flash();
    let userData = {};
    userData.userName = req.body.userName;
    userData.password = req.body.password;
    userData.createdDate = req.body.createdDate;
    userData.numOfTranctions = req.body.numOfTranctions;
    res.render('users/userDataPage', { message: res.locals.message, userData:userData })
  }
  else {
    let appSession = req.session;
    if (appSession.isAuthenticated && appSession.isAdmin) {
      let resultsData = common.checkIfUserCanLogIn(appSession.date, appSession.numOfTranctions, appSession.currentNumOfTranctions)
      if (resultsData.userCanLogIn) {
        let results1 = await loginBl.updateUser(req.body);
        let results2 = await loginBl.getUsers();
        if (results1.isSuccess && results2.isSuccess) {
          appSession.numOfTranctions += 1;
          res.render('users/editUser', { users: results2.users });
        }
        else {
          req.flash('error', "Failed to save user to file.");
          res.locals.message = req.flash();
          let userData = {};
          userData.userName = req.body.userName;
          userData.password = req.body.password;
          userData.createdDate = req.body.createdDate;
          userData.numOfTranctions = req.body.numOfTranctions;
          res.render('users/userDataPage', { message: res.locals.message,  userData:userData })
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

router.get('/deleteUser', async function (req, res, next) {
  let userName = req.query.userName;
  let appSession = req.session;
  if (appSession.isAuthenticated && appSession.isAdmin) {
    let resultsData = common.checkIfUserCanLogIn(appSession.date, appSession.numOfTranctions, appSession.currentNumOfTranctions)
    if (resultsData.userCanLogIn) {
      let results1 = await loginBl.deleteUser(userName);
      let results2 = await loginBl.getUsers();
      if (results1.isSuccess && results2.isSuccess) {
        appSession.numOfTranctions += 1;
        res.render('users/editUser', { users: results2.users });
      }
      else {
        req.flash('error', "Failed to prepare delete user from file.");
        res.locals.message = req.flash();
        res.render('menuPage', { message: res.locals.message, isAdmin: appSession.isAdmin })
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
