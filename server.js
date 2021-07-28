const express = require("express");
const jwt = require("jsonwebtoken");
const https = require("https");
const crypto = require("crypto");
const cryptoJs = require("crypto-js");
const app = express();
const axios = require("axios");
app.use(express.urlencoded({ extended: true }));

app.get("/login", async (req, res) => {
  // const privateKey = require("fs").readFileSync("rs256.key", {
  //   encoding: "utf-8",
  // });
  const payload = {
    iss: "TEST",
    api_key: "cR6fsuoz7K1SpMhJ6HD2WMqTzkBJk0a5",
    jti: `cR6fsuoz7K1SpMhJ6HD2WMqTzkBJk0a5-${Date.now()}`,
  };
  const token = jwt.sign(payload, "MhJ6HD2WMfsuoz7K1Sp0a5qTzkBJkcR6", {
    expiresIn: "2h",
    header: {
      cty: "appotapay-api;v=1",
    },
  });
  const siganture = cryptoJs.enc.Base64.stringify(
    cryptoJs.HmacSHA256(
      "partnerRefId=AB123&productCode=AC100&quantity=10",
      "MhJ6HD2WMfsuoz7K1Sp0a5qTzkBJkcR6"
    )
  );
  console.log(token);
  console.log(siganture);
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
      siganture: siganture,
    },
  });
  console.log(fetchData);

  res.status(201).json({ status: "success", fetchData });
});

app.get("/test", async (req, res) => {
  const https = require("https");

  https
    .get(
      "https://www.vietbank.com.vn/api/ApiBranch/getalltransagencymap",
      (resp) => {
        let data = "";

        // A chunk of data has been received.
        resp.on("data", (chunk) => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on("end", () => {
          console.log(JSON.parse(data));
          return res.status(200).json({ data: JSON.parse(data) });
        });
      }
    )
    .on("error", (err) => {
      console.log("Error: " + err.message);
    });
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

const privateKey = require("fs").readFileSync("private.pem");
const buffer = Buffer.from(
  "auHXmxwVJKAVEJfnUmx03dK/6ZMIhPdhqb612RHAsrk64Kxdp0USl3DLN4RF17aQ9j24wVz24AU6zQXunnjebeoCCr62V7EtrudNNnC1KXfAUOdEzeeXXnF3l+eBUresscBLUo468u+BHfbdWHbHHCH0sRx0StRYwX8wNlk7oBUGPJXCQl8X/Je7G0gm+sy1pBX6YXmjxeWxeuAU9Rm4Rx9K487EXL1UtEkQ360B3D7Sg92dTlAxIeF9JvhK/6WvrakA7IqmvjWBvjfGseVWaiqY6ArwLR/HdQZZJ4pwAJlIPlL87okNEt4UMK96DLUYYjVxA+yYDL2EggJN2/wNpg==",
  "base64"
);
const decrypted = crypto.privateDecrypt(privateKey, buffer);
console.log(decrypted.toString("utf8"));

app.listen(3000, () => {
  console.log("server is running...");
});
