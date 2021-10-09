const express = require("express");
const app = express();
const port = 3000;

//디비연결을 위해 모델 폴더에 요청함
const connect = require("./models");
connect();

//미들웨어 사용을위한코드 req.body를 하기위해서
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//ejs를 랜더탬플릿해주기 위한 코드
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

//정적파일 가져오기
app.use("/assets", express.static("assets"));

// //board 게시글 라우터
const boardRouter = require("./routers/board");
app.use("/api", [boardRouter]);

//user 회원 라우터
const userRouter = require("./routers/user");
app.use("/api2", [userRouter]);

// 첫화면 페이지 여기서 판별 후 login or index 로 보냄
app.get("/", (req, res) => {
  res.render("index");
});

// 로그인페이지
app.get("/login", (req, res) => {
  res.render("login");
});

//회원가입페이지
app.get("/sign_up", (req, res) => {
  res.render("sign_up");
});

//전체 게시판
app.get("/home", (req, res) => {
  res.render("index");
});

//특정 게시글 상세 페이지
app.get("/detail", (req, res) => {
  res.render("detail");
});

//게시글 작성 페이지
app.get("/post", (req, res) => {
  res.render("post");
});

//게시글 수정 및 삭제 페이지
app.get("/edit", (req, res) => {
  res.render("edit");
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});

module.exports = app;
