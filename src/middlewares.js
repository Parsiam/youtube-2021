import multer from "multer";

export const localsMiddleWare = (req, res, next) => {
  res.locals.isLoggedIn = Boolean(req.session.loggedIn);
  res.locals.localUser = req.session.user || {};
  next();
};

export const loggedInUserOnly = (req, res, next) => {
  if (req.session.user === undefined) {
    return res.redirect("/");
  } else {
    return next();
  }
};

export const publicOnly = (req, res, next) => {
  if (req.session.user === undefined) {
    return next();
  } else {
    return res.redirect("/");
  }
};

export const uploadImg = multer({ dest: "uploads/avatar" });

export const uploadVideo = multer({ dest: "uploads/video" });
