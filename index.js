const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
////////////////////////////////////////////////////////////////////
const cookieParser = require("cookie-parser");
dotenv.config({ path: "./config.env" });
////////////////////////////////////////////////////////////////////
const signin = require("./route/sign-in");
const news = require("./route/news");
const blog = require("./route/blog");
const directives = require("./route/directives");
const tv = require("./route/tv-guide");
const contact = require("./route/contact");
const banner = require("./route/banner");
const email = require("./route/email");
const slogan = require("./route/slogan");
const renderDirectivesEn = require("./render/render-directivesEn");

// ////////////////////////////////////////////////////////////////////////
// const { apps } = require('./route/authentication');
// const test = require('./route/test');
// ////////////////////////////////////////////////////////////////////////////

const bodyParser = require("body-parser");
const youtube = require("./route/youtube");

const weather = require("./route/weathers");

const weekly = require("./route/weekly");

const app = express();

const dailyShow = require("./route/daily-shows");

// const livePromo = require('./route/live-promo');
const rednderDirectivesAm = require("./render/render-directivesAm");
const renderHome = require("./render/render-homeEn");
const renderHomeAm = require("./render/render-HomeAm");

app.use(cors());
////////////////////////////////////////////////////////////////////////
app.use(cookieParser());

mongoose
  .connect("mongodb://localhost/eca-db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("Connected to MongoDb ..."))
  .catch((error) => console.log("could not connect to database" + error));

app.use(express.static("./banners"));
app.use(express.static("./directives"));

app.use(express.json());

app.use(express.static("./views"));

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", renderHome);
app.get("/Am", renderHomeAm);

const port = process.env.PORT || 9001;

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/get-bugs", (req, res) => {
  res.send([
    {
      id: 1,
      description: "Bug 1",
      userId: 1,
      resolved: true,
    },
    {
      id: 2,
      description: "Bug 2",
      userId: 1,
    },
    {
      id: 3,
      description: "Bug 3",
      userId: 2,
    },
    {
      id: 4,
      description: "Bug 4",
    },
  ]);
});

app.post("/get-bugs", (req, res) => {
  res.send(req.body);
});

app.patch("/get-bugs/:index", (req, res) => {
  id = req.params.index;
  res.send({ id: id, resolved: req.body.resolved });
});

app.get("/resourceAm", rednderDirectivesAm);

app.get("/contact", (req, res) => {
  res.render("contact");
});
app.get("/faq", (req, res) => {
  res.render("faq");
});

app.get("/guide", (req, res) => {
  res.render("guide");
});

app.get("/resource", renderDirectivesEn);

app.get("/services", (req, res) => {
  res.render("services");
});

app.use("/api", signin);
app.use("/api", news);
app.use("/api", directives);
app.use("/api", blog);
app.use("/api", tv);
app.use("/api", slogan);

app.use("/api", email);
app.use("/api", dailyShow);

app.use("/api", contact);
app.use("/api", weather);
app.use("/api", weekly);
app.use("/api", youtube);
app.use("/api", banner);

app.listen(port, () => console.log(`listening to port ${port}`));
