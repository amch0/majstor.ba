const express = require("express");
const bodyParser = require("body-parser");
const pool = require("./database");
const cors = require("cors");
const path = require("path");

const userRoutes = require("./users/userRoutes.js");
const postRoutes = require("./posts/postRoutes.js");
const commentRoutes = require("./comments/commentRoutes.js");
const requestRoutes = require("./requests/requestRoutes.js");
const contactRoutes = require("./customerSupport/contactRoute.js");
const adminRoutes = require("./admin/adminRoutes.js");

const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(cors());

app.use(
  "/profilePictures",
  express.static(path.join(__dirname, "profilePictures"))
);
app.use("/workPictures", express.static(path.join(__dirname, "workPictures")));

app.use("/users", userRoutes);
app.use("/post", postRoutes);
app.use("/comment", commentRoutes);
app.use("/request", requestRoutes);
app.use("/admin", adminRoutes);
app.use("/contact", contactRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
