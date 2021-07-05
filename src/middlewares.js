import multer from "multer";
import aws from "aws-sdk";
import multerS3 from "multer-s3";

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

export const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

export const uploadImg = multer({
  storage: multerS3({
    s3,
    bucket: "metube-2021-upload/images",
    acl: "public-read",
  }),
  limits: {
    fileSize: 1048576,
  },
});

export const uploadVideo = multer({
  storage: multerS3({
    s3,
    bucket: "metube-2021-upload/videos",
    acl: "public-read",
  }),
  limits: {
    fileSize: 52428800,
  },
});
