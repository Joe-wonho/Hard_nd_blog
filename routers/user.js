const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const router = express.Router();
const authMiddleWare = require("../middlewares/auth-middleware");

//회원가입 API
router.post("/user", async (req, res) => {
  try {
    const { nickname, email, password, confirmPassword } = req.body;

    if (!/[a-zA-Z0-9]+/.test(nickname) || nickname.length < 3) {
      res.status(400).send({
        errorMessage:
          "닉네임은 3자이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9) 를 포함해야합니다.",
      });
      return;
    }
    if (password.includes(nickname) || password.length < 4) {
      res.status(400).send({
        errorMessage: "비밀번호는 4자이상이며 닉네임을 포함하면 안됩니다.",
      });

      return;
    }

    if (password !== confirmPassword) {
      res.status(400).send({
        errorMessage: "패스워드가 패스워드 확인란과 동일하지 않습니다.",
      });
      return;
    }
    const existUsers = await User.find({
      $or: [{ email }, { nickname }],
    });
    if (existUsers.length) {
      res.status(400).send({
        errorMessage: "이미 가입된 이메일 또는 닉네임이 있습니다.",
      });
      return;
    }
    const user = new User({ email, nickname, password });
    await user.save();
    res.status(201).send({});
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
});

//로그인 API
router.post("/auth", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password }).exec();

    if (!user) {
      res.status(400).send({
        errorMessage: "이메일 또는 패스워드가 잘못됐습니다.",
      });
      return;
    }
    //sign을 해야  토큰을 생성할 수 있다. 유의하자!!!!!!!!!!
    const token = jwt.sign({ userId: user.userId }, "wonho-secret-key");
    res.send({
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
});

//api확인을 위해 임시로 써놓은 코드
router.get("/users/me", authMiddleWare, async (req, res, next) => {
  const { user } = res.locals;
  res.send({
    user: {
      email: user.email, //지금 user안에 pw도 같이있기에 이렇게 하는게 제일 베스트다
      nickname: user.nickname,
    },
  });
});

module.exports = router;
