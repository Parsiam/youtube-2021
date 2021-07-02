import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

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

const s3 = new aws.S3({
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

const uploadVideo = multer({
  storage: multerS3({
    s3,
    bucket: "metube-2021-upload/videos",
    acl: "public-read",
  }),
  limits: {
    fileSize: 52428800,
  },
});

export const errorHandleUploadImg = (req, res, next) => {
  const upload = uploadImg.single("avatar");
  console.log(req.body, "start");
  upload(req, res, function (err) {
    console.log(req.body, "multer");
    if (err) {
      req.flash("error", "1MB 이하의 이미지만 업로드할 수 있습니다.");
      return res.status(400).render("user/me", { pageTitle: "내 정보" });
    }
  });
  next();
};

export const errorHandleUploadVideo = (req, res) => {
  const upload = uploadVideo.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]);

  upload(req, res, function (err) {
    if (err) {
      req.flash("error", "50MB 이하의 동영상만 업로드할 수 있습니다.");
      return res
        .status(400)
        .render("video/upload", { pageTitle: "동영상 업로드" });
    }
  });
};
