const express = require("express");
const bodyParser = require("body-parser");
const { render } = require("express/lib/response");

const app = express();

app.use(express.static("./views"));

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  const slider = "data";
  res.render("index", { slider });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});
app.get("/faq", (req, res) => {
  res.render("faq");
});

app.get("/guide", (req, res) => {
  res.render("guide");
});

app.get("/services", (req, res) => {
  res.render("services");
});

app.listen(3001, () => {
  console.log("server is listning to port 3001");
});
