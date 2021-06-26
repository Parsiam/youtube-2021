export const localsMiddleWare = (req, res, next) => {
  if (req.session) {
    res.locals.isLoggedIn = req.session.loggedIn;
    res.locals.user = req.session.user;
  }
  console.log(req.session);
  console.log(res.locals);
  next();
};
