import User from "../models/User";
import Video from "../models/Video";
import Comment from "../models/Comment";
import { s3, uploadVideo } from "../middlewares";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).populate("owner");
    return res.render("home", { pageTitle: "Home", videos });
  } catch (error) {}
};

export const getUpload = (req, res) =>
  res.render("video/upload", { pageTitle: "동영상 업로드" });

export const postUpload = (req, res) => {
  const upload = uploadVideo.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]);

  upload(req, res, async (err) => {
    const {
      body: { title, description, hashtags },
      files,
      session: {
        user: { _id },
      },
    } = req;

    if (err) {
      req.flash("error", "50MB 이하의 동영상만 업로드할 수 있습니다.");
      return res
        .status(400)
        .render("video/upload", { pageTitle: "동영상 업로드" });
    } else {
      const video = await Video.create({
        title,
        description,
        hashtags: hashtags !== "" ? Video.formatHashtags(hashtags) : "",
        fileURL: files.video[0].location,
        thumbnailURL: files.thumbnail[0].location,
        owner: req.session.user._id,
      });

      const user = await User.findById(_id);
      user.videos.push(video._id);
      await user.save();
      req.flash("info", "동영상을 업로드했습니다.");
      return res.redirect("/");
    }
  });
};

export const getDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id)
      .populate("owner")
      .populate({
        path: "comments",
        populate: { path: "owner", model: "User" },
      });

    return res.render("video/detail", { pageTitle: video.title, video });
  } catch (error) {
    console.log(error);
  }
};

export const getDelete = async (req, res) => {
  try {
    const {
      params: { id },
      session: {
        user: { _id },
      },
    } = req;
    const video = await Video.findById(id);
    if (!video) {
      req.flash("error", "동영상을 삭제할 수 없습니다.");
      return res.status(404).redirect("/");
    }
    if (String(video.owner) !== String(_id)) {
      req.flash("error", "동영상을 삭제할 수 없습니다.");
      return res.status(403).redirect("/");
    }

    const fileURL = video.fileURL.split("com/")[1];
    const thumbnailURL = video.thumbnailURL.split("com/")[1];

    s3.deleteObjects(
      {
        Bucket: "metube-2021-upload",
        Delete: { Objects: [{ Key: fileURL }, { Key: thumbnailURL }] },
      },
      (err, data) => {
        if (err) {
          throw err;
        }
      }
    );

    await Video.findByIdAndDelete(id);
    req.flash("info", "동영상을 삭제했습니다.");
    return res.redirect("/");
  } catch (error) {}
};

export const addView = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
      return res.sendStatus(404);
    }
    video.meta.views++;
    await video.save();
    return res.sendStatus(200);
  } catch (error) {}
};

export const addComment = async (req, res) => {
  try {
    const {
      params: { id },
      body: { text },
      session: { user },
    } = req;

    const video = await Video.findById(id);

    if (!video) {
      return res.sendStatus(404);
    }

    const comment = await Comment.create({
      text,
      owner: user._id,
    });

    video.comments.push(comment._id);
    await video.save();

    return res.status(201).send(comment._id);
  } catch (error) {}
};

export const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const video = await Video.findById(id);
    const comment = await Comment.findById(commentId);
    if (!comment || !video) {
      return res.sendStatus(404);
    }
    video.comments = video.comments.filter(
      (item) => String(item) !== String(comment._id)
    );
    await video.save();
    await Comment.findByIdAndDelete(commentId);
    return res.sendStatus(204);
  } catch (error) {
    console.log(error);
  }
};

export const getSearch = async (req, res) => {
  const { search_query } = req.query;
  let videos = [];
  if (search_query) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(`${search_query}$`, "i"),
      },
    }).populate("owner");
  }
  res.render("video/search", { pageTitle: search_query, videos, search_query });
};
