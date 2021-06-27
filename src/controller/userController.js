import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

export const getLogin = (req, res) => res.render("user/login");

export const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, social: false });

    if (!user) {
      return res
        .status(400)
        .render("login", { error: "해당 이메일이 존재하지 않습니다." });
    }

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return res
        .status(400)
        .render("login", { error: "비밀번호가 일치하지 않습니다." });
    }

    req.session.loggedIn = true;
    req.session.user = user;

    return res.redirect("/");
  } catch (error) {}
};

export const getLogout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const getCreateAccount = (req, res) => res.render("user/create-account");

export const postCreateAccount = async (req, res) => {
  const { email, firstName, lastName, password, password2 } = req.body;

  const user = await User.exists({ email });

  if (user) {
    return res
      .status(400)
      .render("create-account", { error: "해당 이메일이 이미 존재합니다." });
  }

  if (password !== password2) {
    return res
      .status(400)
      .render("create-account", { error: "비밀번호가 일치하지 않습니다." });
  }
  await User.create({
    email,
    firstName,
    lastName,
    password,
  });
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
    return res
      .status(400)
      .render("login", { error: "해당 이메일이 존재합니다." });
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
  console.log(user);
  req.session.loggedIn = true;
  req.session.user = user;

  return res.redirect("/");
};

export const userProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    return res.render("user/profile.pug", { user });
  } catch (error) {}
};

export const getMe = (req, res) => {
  return res.render("user/me");
};

export const postME = async (req, res) => {
  try {
    const {
      file,
      body: { firstName, lastName },
      session: {
        user: { _id, avatarURL },
      },
    } = req;

    const user = await User.findByIdAndUpdate(
      _id,
      {
        avatarURL: file ? file.path : avatarURL,
        firstName,
        lastName,
      },
      { new: true }
    );

    req.session.user = user;

    return res.redirect("/user/me");
  } catch (error) {}
};
