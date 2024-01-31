function isEmpty(value) {
  return !value || value.trim() === '';
}

function userCredentialsAreValid(email, password) {
  return email && email.includes('@') && password && password.trim() >= 6;
}

function userDetailsAreValid(user) {
  const { email, password, fullname, street, postal, city } = user;
  return (
    userCredentialsAreValid(email, password) &&
    !isEmpty(fullname) &&
    !isEmpty(street) &&
    !isEmpty(postal) &&
    !isEmpty(city)
  );
}

function emailIsConfirmed(email, confirmEmail) {
  return email === confirmEmail;
}

// valid password, and valid email function
// and required fields from request
function emailIsValid(email) {
  // base validation
  return email && email.includes('@');
}

function passwordIsValid(password) {
  // min(6) chars
  return password && password.trim().length >= 6;
}

// empty fields
function getEmptyFields(fields = {}) {
  if (typeof fields !== 'object') {
    throw new Error('Invalid type');
  }
  const emptyFields = [];
  // for (const key in fields)
  for (const [key] of Object.entries(fields)) {
    if (typeof fields[key] === 'string') {
      if (!fields[key] && fields[key].trim().length === 0) {
        emptyFields.push(key);
      }
    }
  }
  return emptyFields;
}

// validate request
// isValidSignUpRequest
function isValidSignupRequest(req) {}
// getSignupRequestErrors
function getSignupRequestErrors(req) {
  const errors = [];
  const email = req.email;
  const confirmEmail = req['confirm-email'];
  const password = req.password;
  const { fullname, street, postal, city } = req;
  const emptyFieldsVector = getEmptyFields({ fullname, street, postal, city });

  // invalid email ?
  if (!emailIsValid(email)) {
    errors.push('email is not valid');
  }
  // invalid email is confirmed?
  if (!emailIsConfirmed(email, confirmEmail)) {
    errors.push('email and confirm email did not match');
  }
  // invalid password?
  if (!passwordIsValid(password)) {
    errors.push('password is not valid must have at least 6 chars');
  }
  // error message for required fields
  if (emptyFieldsVector.length) {
    let message;
    if (emptyFieldsVector.length === 1) {
      message = `${emptyFieldsVector[0]} is required`;
    } else {
      const lastValue = emptyFieldsVector.pop();
      message = `${emptyFieldsVector.join(', ')} and ${lastValue} are required`;
    }
    errors.push(message);
  }
  return errors;
}

// module.exports = { userDetailsAreValid, emailIsConfirmed };
module.exports = { getSignupRequestErrors, isValidSignupRequest };
