const User = require('../models/user.model');
const authUtil = require('../util/authentication');
const validation = require('../util/validation');
const sessionValidation = require('../util/validation-session');
const sessionFlash = require('../util/session-flash');

function getSignup(req, res) {
  const sessionData = sessionFlash.getSessionData(req);

  res.render('customer/auth/signup', {
    inputData: sessionData,
  });
}

async function signup(req, res) {
  // ....
  const userData = req.body;
  const signupData = {
    email: userData.email,
    confirmEmail: userData['confirm-email'],
    password: userData.password,
    fullname: userData.fullname,
    street: userData.street,
    postal: userData.postal,
    city: userData.city,
  };

  const signupRequestErrors = validation.getSignupRequestErrors(req.body);

  if (signupRequestErrors.length) {
    sessionFlash.flashDataToSession(
      req,
      {
        message: signupRequestErrors.join(', '),
        ...signupData,
      },
      () => {
        res.redirect('/signup');
      }
    );
    return;
  }

  const user = new User(userData);

  try {
    const existsAlready = await user.existsAlready();

    if (existsAlready) {
      sessionFlash.flashDataToSession(
        req,
        {
          message: 'User registered, try login.',
          ...signupData,
        },
        () => {
          res.redirect('/signup');
        }
      );
      return;
    }

    await user.signup();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect('/login');
}

function getLogin(req, res) {
  // ....
  const sessionErrorData = sessionFlash.getSessionData(req);

  res.render('customer/auth/login', {
    inputData: sessionErrorData,
  });
}

async function login(req, res) {
  const userData = req.body;
  const loginData = {
    email: userData.email,
    password: userData.password,
  };

  const user = new User();

  const existingUser = await user.getUserWithSameEmail(loginData.email);

  // if (!existingUser) {
  //   sessionFlash.flashDataToSession(
  //     req,
  //     {
  //       message: 'Invalid credentials',
  //       ...loginData,
  //     },
  //     () => {
  //       res.redirect('/login');
  //     }
  //   );
  //   return;
  // }

  // const passwordsAreEqual = await user.comparePassword(
  //   loginData.password,
  //   existingUser.password
  // );

  if (
    !existingUser ||
    !(await user.comparePassword(loginData.password, existingUser.password))
  ) {
    sessionFlash.flashDataToSession(
      req,
      {
        message: 'Invalid credentials',
        ...loginData,
      },
      () => {
        res.redirect('/login');
      }
    );
    return;
  }

  authUtil.createUserSession(req, existingUser, () => {
    res.redirect('/');
  });
}

function logout(req, res) {
  authUtil.removeUserAuthSession(req);
  res.redirect('/login');
}

module.exports = {
  getSignup,
  getLogin,
  signup,
  login,
  logout,
};
