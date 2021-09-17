const express = require("express");

const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const path = require("path");

const cors = require("cors");

const app = express();
app.enable("trust proxy");
app.use(helmet());

const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000, //100 requests per hour
  message: "Too many requests from this IP. Please try again in an hour.",
  headers: true,
  draft_polli_ratelimit_headers: true,
});
app.use("/api", limiter);
app.use(express.json({ limit: "10kb" }));

app.use(cors());

app.use(express.urlencoded({ extended: true }));

const fs = require("fs");
const rulesFile = fs.readFileSync("password.rules.json");
let rules = JSON.parse(rulesFile).rules;

app.post("/passwords", (req, res) => {
  const password = req.body.password;
  let errors = [];
  let message = null;
  let status;

  rules.forEach((el, i) => {
    var regex = new RegExp(el.regex);
    var rex = regex.test(password);

    if (!rex && el.name != "repeating_char") {
      errors.push(el.message);
    }
    if (rex && el.name == "repeating_char") {
      errors.push(el.message);
    }
  });

  if (errors.length != 0) {
    status = 400;
    message = "Password is invalid";
  } else {
    status = 200;
    message = "Success";
  }
  return res.status(status).json({
    message: message,
    errors,
  });
});

module.exports = app;
