import User from "../models/User";
import bcrypt from "bcrypt";

export const getLogin = (req, res) => res.render("login");

export const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

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

export const getCreateAccount = (req, res) => res.render("create-account");

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
