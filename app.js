const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Error = require("./middelware/error");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const cookieSaessaion = require("cookie-session");
require("./utile/passport");
const passport = require("passport");
const passportRoutr = require("./utile/google_auth");
const path = require("path");

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("DB Connection Successfull!"))
.catch((err) => { console.log("failed to connect datacase");});

const session = require("express-session");

app.use(
  session({
    secret: "somethingsecretgoeshere",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/auth", passportRoutr);

require("./routes/index")(app);

app.use(express.static(path.join(__dirname, "/client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/build/index.html"));
});
// handel error
process.on("uncaughtException", (ex) => {
  console.log("uncaughtException");
});
app.use(Error);

app.listen(process.env.PORT || 5000, () => {
  console.log(
    "Backend server is running at port " + (process.env.PORT || 5000)
  );
});

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);
  server.close(() => {
    process.exit(1);
  });
});
