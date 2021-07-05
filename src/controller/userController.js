import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";
import { uploadImg } from "../middlewares";

export const getLogin = (req, res) =>
  res.render("user/login", { pageTitle: "로그인" });

export const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, social: false });

    if (!user) {
      req.flash("error", "해당 이메일이 존재하지 않습니다.");
      return res.status(400).render("user/login");
    }

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      req.flash("error", "비밀번호가 일치하지 않습니다.");
      return res.status(400).render("user/login");
    }

    req.session.loggedIn = true;
    req.session.user = user;

    req.flash("info", "로그인에 성공했습니다.");
    return res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

export const getLogout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const getCreateAccount = (req, res) =>
  res.render("user/create-account", { pageTitle: "회원가입" });

export const postCreateAccount = async (req, res) => {
  const { email, userName, password, password2 } = req.body;

  const user = await User.exists({ email });

  if (user) {
    req.flash("error", "해당 이메일이 이미 존재합니다.");
    return res.status(400).render("user/create-account");
  }

  if (password !== password2) {
    req.flash("error", "비밀번호가 일치하지 않습니다.");
    return res.status(400).render("user/create-account");
  }
  await User.create({
    email,
    userName,
    password,
  });
  req.flash("info", "회원가입에 성공했습니다.");
  return res.redirect("/");
};

export const ghStart = (req, res) => {
  const baseURL = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const configURL = new URLSearchParams(config).toString();
  const finalURL = `${baseURL}?${configURL}`;
  res.redirect(finalURL);
};

export const ghFinish = async (req, res) => {
  try {
    const { code } = req.query;
    const baseURL = "https://github.com/login/oauth/access_token";
    const config = {
      client_id: process.env.GH_CLIENT,
      client_secret: process.env.GH_SECRET,
      code,
    };
    const configURL = new URLSearchParams(config).toString();
    const finalURL = `${baseURL}?${configURL}`;

    const { access_token } = await (
      await fetch(finalURL, {
        method: "POST",
        headers: { Accept: "application/json" },
      })
    ).json();

    const emails = await (
      await fetch("https://api.github.com/user/emails", {
        headers: { Authorization: `token ${access_token}` },
      })
    ).json();

    const { email } = emails.find(
      (email) => email.verified === true && email.primary === true
    );

    const checkEmail = await User.exists({ email, social: false });
    if (checkEmail) {
      req.flash("error", "해당 이메일이 이미 존재합니다.");
      return res.status(400).render("user/login");
    }
    let user = {};
    user = await User.findOne({ email, social: true });
    if (!user) {
      user = await User.create({
        email,
        social: true,
        password: "",
      });
    }

    req.session.loggedIn = true;
    req.session.user = user;
    req.flash("info", "깃허브 로그인에 성공했습니다.");
    return res.redirect("/");
  } catch (error) {}
};

export const userProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate("videos");

    return res.render("user/profile.pug", { user });
  } catch (error) {}
};

export const getMe = (req, res) =>
  res.render("user/me", { pageTitle: "내 정보" });

export const postME = (req, res) => {
  const upload = uploadImg.single("avatar");

  upload(req, res, async (err) => {
    const {
      body: { userName },
      file,
      session: {
        user: { _id, avatarURL },
      },
    } = req;
    const prevURL = avatarURL;

    const user = await User.findOneAndUpdate(
      { _id },
      {
        avatarURL: file ? file.location : avatarURL,
        userName,
      },
      { new: true }
    );

    if (err) {
      req.flash("error", "1MB 이하의 이미지만 업로드할 수 있습니다.");
      return res.status(400).render("user/me", { pageTitle: "내 정보" });
    } else {
      if (file) {
        User.deletePrevAvatar(prevURL);
      }
      req.session.user = user;
      req.flash("info", "내 정보를 수정했습니다.");
      return res.redirect("/user/me");
    }
  });
};
