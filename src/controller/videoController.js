import User from "../models/User";
import Video from "../models/Video";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({});
    req.flash("hello", "wow");
    return res.render("home", { videos });
  } catch (error) {}
};

export const getUpload = (req, res) => res.render("video/upload");

export const postUpload = async (req, res) => {
  try {
    const {
      body: { title, description, hashtags },
      file: { path },
      session: {
        user: { _id },
      },
    } = req;

    const video = await Video.create({
      title,
      description,
      hastags: Video.hashtags(hashtags),
      fileURL: path,
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

    return res.render("video/detail", { video });
  } catch (error) {}
};

export const getDelete = async (req, res) => {
  try {
    const { id } = req.params;
    await Video.findOneAndDelete(id);
    return res.redirect("/");
  } catch (error) {}
};
