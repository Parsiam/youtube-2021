import User from "../models/User";
import Video from "../models/Video";
import Comment from "../models/Comment";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).populate("owner");
    return res.render("home", { pageTitle: "Home", videos });
  } catch (error) {}
};

export const getUpload = (req, res) =>
  res.render("video/upload", { pageTitle: "동영상 업로드" });

export const postUpload = async (req, res) => {
  try {
    const {
      body: { title, description, hashtags },
      files,
      session: {
        user: { _id },
      },
    } = req;

    const video = await Video.create({
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
      fileURL: files.video[0].path,
      thumbnailURL: files.thumbnail[0].path,
      owner: req.session.user._id,
    });

    const user = await User.findById(_id);
    user.videos.push(video._id);
    await user.save();

    return res.redirect("/");
  } catch (error) {
    console.log(error);
  }
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
      return res.status(404).render("404", { pageTitle: "Video not found." });
    }
    if (String(video.owner) !== String(_id)) {
      return res.status(403).redirect("/");
    }
    await Video.findByIdAndDelete(id);
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
    const { id } = req.params;

    const comment = await Comment.exists({ _id: id });
    if (!comment) {
      return res.sendStatus(404);
    }
    await Comment.findByIdAndDelete(id);
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
