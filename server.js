const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const crypto = require("crypto");
const sign = crypto.createHmac("SHA256", "MhJ6HD2WMfsuoz7K1Sp0a5qTzkBJkcR6");
const axios = require("axios");
app.use(express.urlencoded({ extended: true }));

app.get("/login", async (req, res) => {
  // const privateKey = require("fs").readFileSync("rs256.key", {
  //   encoding: "utf-8",
  // });
  const payload = {
    iss: "TEST",
    api_key: "cR6fsuoz7K1SpMhJ6HD2WMqTzkBJk0a5",
    jti: `cR6fsuoz7K1SpMhJ6HD2WMqTzkBJk0a5-${Date.now}`,
  };
  const token = jwt.sign(payload, "MhJ6HD2WMfsuoz7K1Sp0a5qTzkBJkcR6", {
    algorithm: "HS256",
    expiresIn: "2h",
  });
  const signature = jwt.sign(
    "partnerRefId=AB123&productCode=AC100&quantity=10",
    "MhJ6HD2WMfsuoz7K1Sp0a5qTzkBJkcR6",
    {
      algorithm: "HS256",
    }
  );
  console.log(token);
  console.log(signature);
  const fetchData = await axios({
    method: "post",
    url: "https://ebill.dev.appotapay.com/api/v1/service/shopcard/buy",
    headers: {
      "Content-Type": "application/json",
      "X-APPOTAPAY-AUTH": `Bearer ${token}`,
    },
    data: {
      partnerRefId: "AB123",
      productCode: "AC100",
      quantity: 10,
      siganture: signature,
    },
  });
  console.log(fetchData);

  res.status(201).json({ status: "success", fetchData });
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

app.listen(3000, () => {
  console.log("server is running...");
});
