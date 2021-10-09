const express = require("express");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const Boards = require("../models/board");
const User = require("../models/user");
const Comments = require("../models/comment");
const authMiddleWare = require("../middlewares/auth-middleware");
const router = express.Router();

router.get("/board", async (req, res, next) => {
  try {
    const boards = await Boards.find().sort("-date");
    res.json({ boards: boards });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/board/:boardId", async (req, res) => {
  const { boardId } = req.params;
  boards = await Boards.findOne({ boardId: boardId });
  res.json({ detail: boards });
});

//게시글 저장 기능 -->사용자 확인 뒤에 작성, 삭제, 수정 가능하게 설정하기
router.post("/board", authMiddleWare, async (req, res) => {
  const { userId, nickname } = res.locals.user;
  const { title, post_pw, contents } = req.body;
  const username = nickname;
  const current = new Date();
  const boardId = current;
  const date =
    current.getFullYear() +
    "-" +
    ("0" + (current.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + current.getDate()).slice(-2) +
    "-" +
    current.getHours() +
    "-" +
    current.getMinutes() +
    "-" +
    current.getSeconds();

  isExist = await Boards.find({ userId, boardId });

  if (isExist.length == 0) {
    await Boards.create({ boardId, title, username, post_pw, date, contents });
  }
  res.send({ result: "success" });
});

//게시글 삭제기능
router.delete("/board/:boardId", authMiddleWare, async (req, res) => {
  const { boardId } = req.params;
  const { post_pw } = req.body;
  const deleteBoard = await Boards.findOne({ boardId: boardId });
  isExist = deleteBoard;
  let action = "";

  if (isExist && deleteBoard["post_pw"] == post_pw) {
    await Boards.deleteOne({ boardId });
    res.send({ action: "success" });
  } else {
    res.send({ action: "fail" });
  }
});

//게시글 수정기능
router.patch("/board/:boardId", authMiddleWare, async (req, res) => {
  const { userId, nickname } = res.locals.user;
  const { boardId } = req.params;
  const { title, post_pw, contents } = req.body;
  const updating_Board = await Boards.findOne({ boardId: boardId });
  isExist = updating_Board;
  let action = "";

  if (updating_Board["post_pw"] == post_pw && isExist) {
    await Boards.updateOne({ boardId }, { $set: { title, contents } });

    res.send({ action: "success" });
  } else {
    res.send({ action: "fail" });
  }
});

//댓글 저장기능
router.post("/comment/:boardId", authMiddleWare, async (req, res) => {
  const { nickname } = res.locals.user;
  const { boardId } = req.params;
  const { comment } = req.body;
  const username = nickname;

  const date = new Date().toISOString();
  console.log(date);
  await Comments.create({ boardId, username, date, comment });
  res.send({ result: "success" });
});

//댓글 get기능
router.get("/comment/:boardId", async (req, res) => {
  const { boardId } = req.params;

  isExist = await Comments.findOne({ boardId: boardId });
  if (!isExist) {
    res.send({ result: "fail" });
  } else {
    comments = await Comments.find({ boardId: boardId }).sort("-date");
    res.json({ comments: comments });
  }
});

//댓글 삭제기능
router.delete("/comment/:commentId", authMiddleWare, async (req, res) => {
  const { commentId } = req.params; //커멘트의 커멘트 ID
  const { nickname } = res.locals.user; // 현재 사용중임 사용자이름
  const findComment = await Comments.findById(commentId); // 커멘트의 커멘트 ID가 동일한게 있으면 커멘트객체를 불러옴
  let action = "";
  if (nickname == findComment["username"]) {
    await Comments.deleteOne({ _id: commentId });
    res.send({ action: "success" });
  } else {
    res.send({ action: "fail" });
  }
});

//댓글 수정기능
router.patch("/comment/:commentId", authMiddleWare, async (req, res) => {
  const { commentId } = req.params; //커멘트의 커멘트 ID
  const { nickname } = res.locals.user; // 현재 사용중임 사용자이름
  const findComment = await Comments.findById(commentId); // 커멘트의 커멘트 ID가 동일한게 있으면 커멘트객체를 불러옴
  const { comment } = req.body;

  if (comment == "") {
    return;
  }

  let action = "";
  if (nickname == findComment["username"]) {
    //자기가 쓴글 아니면 못지우게 하는 것
    await Comments.updateOne({ _id: commentId }, { $set: { comment } });
    res.send({ action: "success" });
  } else {
    res.send({ action: "fail" });
  }
});

module.exports = router;
