const connect = require("../models");
const server = require("../app");
const supertest = require("supertest");
const User = require("../models/user");

const userIds = [];
beforeAll(async () => {
  await connect();
  const user = await User.create({ nickname: "something", password: "1234" });
  userIds.push(user._id);
});

describe("회원 가입 유효성 검사", () => {
  app = supertest(server);
  it("too short password", async () => {
    const res = await app.post("/api2/user").send({
      nickname: "another",
      password: "123",
      confirmPassword: "123",
    });
    expect(res.status).toBe(400);
    expect(res.text).toBe("비밀번호는 4자이상이며 닉네임을 포함하면 안됩니다.");
  });

  it("password includes nickname", async () => {
    const res = await app.post("/api2/user").send({
      nickname: "another",
      password: "another",
      confirmPassword: "another",
    });
    expect(res.status).toBe(400);
    expect(res.text).toBe("비밀번호는 4자이상이며 닉네임을 포함하면 안됩니다.");
  });

  it("duplicated nickname", async () => {
    const res = await app.post("/api2/user").send({
      nickname: "something",
      password: "12345678",
      confirmPassword: "12345678",
    });
    expect(res.status).toBe(400);
    expect(res.text).toBe("중복된 닉네임입니다.");
  });

  it("weird nickname", async () => {
    const res = await app.post("/api2/user").send({
      nickname: "가나다라마",
      password: "12345678",
      confirmPassword: "12345678",
    });
    expect(res.status).toBe(400);
    expect(res.text).toBe(
      "닉네임은 3자이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9) 를 포함해야합니다."
    );
  });

  it("too short nickname", async () => {
    const res = await app.post("/api2/user").send({
      nickname: "a",
      password: "12345678",
      confirmPassword: "12345678",
    });
    expect(res.status).toBe(400);
    expect(res.text).toBe(
      "닉네임은 3자이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9) 를 포함해야합니다."
    );
  });

  it("incorrect password and confirmPassword", async () => {
    const res = await app.post("/api2/user").send({
      nickname: "superman",
      password: "asdfqwer",
      confirmPassword: "12345678",
    });
    expect(res.status).toBe(400);
    expect(res.text).toBe("비밀번호가 일치하지 않습니다.");
  });

  it("incorrect password and confirmPassword", async () => {
    const res = await app.post("/api2/user").send({
      nickname: "superman",
      password: "waterbalm",
      confirmPassword: "waterbaml",
    });
    expect(res.status).toBe(400);
    expect(res.text).toBe("비밀번호가 일치하지 않습니다.");
  });
});

afterAll(async () => {
  await User.deleteMany({ _id: userIds });
});
