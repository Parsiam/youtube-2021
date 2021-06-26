import Video from "../models/Video";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({});
    return res.render("home", { videos });
  } catch (error) {}
};

export const postCreate = async (req, res) => {
  try {
    const { title, description, hashtags } = req.body;
    const video = new Video({
      title,
      description,
      hastags: hashtags.split(",").map((item) => `#${item}`),
      createdAt: Date.now(),
      meta: {
        views: 0,
        rating: 0,
      },
    });

    await video.save();
    return res.redirect("/");
  } catch (error) {}
};
