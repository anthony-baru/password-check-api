const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");
const app = express();
const fs = require("fs");
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000, //100 requests per hour
  message: "Too many requests from this IP. Please try again in an hour.",
  headers: true,
  draft_polli_ratelimit_headers: true,
});
const rulesFile = fs.readFileSync("password.rules.json");

app.enable("trust proxy");
app.use(helmet());
app.use("/api", limiter);
app.use(express.json({ limit: "10kb" }));

app.use(cors());

app.use(express.urlencoded({ extended: true }));

let rules = JSON.parse(rulesFile).rules;

app.post("/passwords", (req, res) => {
  const password = req.body.password;
  let errors = [];
  let message = null;
  let status;

  rules.forEach((el, i) => {
    const regex = new RegExp(el.regex);
    const rex = regex.test(password);

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
