export const localsMiddleWare = (req, res, next) => {
  res.locals.isLoggedIn = Boolean(req.session.loggedIn);
  res.locals.user = req.session.user || {};

  next();
};
