import User from "../models/User";
import Video from "../models/Video";

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
    const video = await Video.findById(id).populate("owner");
    return res.render("video/detail", { pageTitle: video.title, video });
  } catch (error) {}
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
