const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.urlencoded({ extended: true }));

app.get("/login", (req, res) => {
  const privateKey = require("fs").readFileSync("rs256.key", {
    encoding: "utf-8",
  });
  const payload = {
    name: "tien",
    age: 18,
  };
  const token = jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "2m",
  });
  res.status(201).json({ status: "success", token });
});

app.post("/post/:token", async (req, res) => {
  const { token } = req.params;
  if (!token) {
    res.status(403).json({ status: "faile", message: "missing token" });
  }
  const publickey = require("fs").readFileSync("rs256.key.pub");
  jwt.verify(token, publickey, { algorithms: "RS256" }, (error, decode) => {
    if (error) {
      return res
        .status(403)
        .json({ status: "failed", message: "Error token." });
    } else {
      return res.status(200).json({ status: "success", decode });
    }
  });
});

app.listen(5000, () => {
  console.log("server is running...");
});
