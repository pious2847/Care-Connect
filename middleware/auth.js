const Hospitals = require('../models/hospitals');
const Pharmacies = require('../models/pharmacy');
const Staffs = require('../models/staffs');
const Patient = require('../models/patients');

const isLoggedIn = async (req, res, next) => {
  try {
    // Check if session exists and has necessary information
    if (req.session && req.session.accountId && req.session.accountType) {
      let account;

      // Determine the model based on account type
      switch (req.session.accountType) {
        case 'hospitals':
          account = await Hospitals.findById(req.session.accountId);
          break;
        case 'pharmacies':
          account = await Pharmacies.findById(req.session.accountId);
          break;
        case 'staff':
          account = await Staffs.findById(req.session.accountId);
          break;
        case 'patient':
          account = await Patient.findById(req.session.accountId);
          break;
        default:
          throw new Error('Invalid account type');
      }

      // Check if account exists
      if (account) {
        // Attach the account to the request for further use if needed
        req.user = account;
        req.accountType = req.session.accountType;

        return next();
      }
    }

    // If no valid session or account found
    req.flash("message", "Please login to access the page");
    req.flash("status", "danger");
    return res.redirect('/login');

  } catch (error) {
    console.error('Authentication error:', error);
    req.flash("message", "An error occurred. Please login again");
    req.flash("status", "danger");
    return res.redirect('/login');
  }
};

const isServiceOwner = async (req, res, next) => {
  try {
    // Check if session exists and has necessary information
    if (req.session && req.session.accountId && req.session.accountType) {
      let account;

      // Determine the model based on account type
      switch (req.session.accountType) {
        case 'hospitals':
          account = await Hospitals.findById(req.session.accountId);
          break;
        case 'pharmacies':
          account = await Pharmacies.findById(req.session.accountId);
          break;
        case 'staff':
          account = await Staffs.findById(req.session.accountId);
          break;
        case 'patient':
          account = await Patient.findById(req.session.accountId);
          break;
        default:
          throw new Error('Invalid account type');
      }

      // Check if account exists
      if (account && account.isOwner === true) {
        // Attach the account to the request for further use if needed
        req.user = account;
        req.accountType = req.session.accountType;

        return next();
      }
    }

    // If no valid session or account found
    req.flash("message", "Please login as Admin access the page");
    req.flash("status", "danger");
    return res.redirect('/login');

  } catch (error) {
    console.error('Authentication error:', error);
    req.flash("message", "An error occurred. Please login again");
    req.flash("status", "danger");
    return res.redirect('/login');
  }
};
const preventLoggedInAccess = (req, res, next) => {
  // Check if user is already logged in
  if (req.session && req.session.accountId && req.session.accountType) {
    // Redirect to appropriate dashboard based on account type
    const accountType = req.session.accountType;
    const accountId = req.session.accountId;

    // Flash a message about already being logged in
    req.flash('message', 'You are already logged in');
    req.flash('status', 'info');

    // Redirect to the corresponding dashboard
    return res.redirect(`/dashboard/${accountType}/${accountId}`);
  }

  // If not logged in, proceed to the login page
  next();
};

module.exports = preventLoggedInAccess;
// Check if user is an admin
const isAdmin = (req, res, next) => {
  if (req.session && req.session.userId) {
    User.findById(req.session.userId)
      .then(user => {
        if (user && user.isAdmin === true) {
          // User is logged in and is an admin
          next();
        } else {
          // User is not an admin, redirect to login page or handle the unauthorized access
          req.flash("alertMessage", "Please login as admin");
          req.flash("alertStatus", "danger");
          res.redirect('/login');
        }
      })
      .catch(err => {
        // Error occurred while fetching the user, handle it appropriately
        res.redirect('/login');
      });
  } else {
    // User is not logged in, redirect to login page or handle the unauthorized access
    res.redirect('/login');
  }
};


module.exports = { isServiceOwner,isLoggedIn, isAdmin,preventLoggedInAccess };
