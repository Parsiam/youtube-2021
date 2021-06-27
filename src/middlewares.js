import multer from "multer";

export const localsMiddleWare = (req, res, next) => {
  res.locals.isLoggedIn = Boolean(req.session.loggedIn);
  res.locals.localUser = req.session.user || {};

  next();
};

export const uploadImg = multer({ dest: "uploads/avatar" });

export const uploadVideo = multer({ dest: "uploads/video" });
