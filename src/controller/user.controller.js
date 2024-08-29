const { signupService, loginService } = require("../service/user.service");

const postSignupUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    let data = {
      email,
      password,
    };
    let rs = await signupService(data);
    return res.status(200).json({
      EC: 0,
      DT: rs,
      EM: "Create user successfully",
    });
  } catch (error) {
    return res.status(400).json({
      EC: -1,
      DT: null,
      EM: error.message,
    });
  }
};

const postLoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    let data = {
      email,
      password,
    };
    let rs = await loginService(data);
    return res.status(200).json({
      EC: 0,
      DT: rs,
      EM: "Login successfully",
    });
  } catch (error) {
    return res.status(400).json({
      EC: -1,
      DT: null,
      EM: error.message,
    });
  }
};

module.exports = {
  postSignupUser,
  postLoginUser,
};
