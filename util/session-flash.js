function getSessionData(req) {
  let sessionData = req.session.flashedData;

  if (!sessionData) {
    sessionData = {
      hasError: false,
      ...req.body,
    };
  }

  req.session.flashedData = null;

  return sessionData;
}

function flashDataToSession(req, data, action) {
  req.session.flashedData = {
    hasError: true,
    ...data,
  };
  req.session.save(action);
}

module.exports = { getSessionData, flashDataToSession };
