const express = require("express");

const { getCategories } = require("./controllers/categories.controller");
const { getReviewById, updateReviewById } = require("./controllers/reviews.controller");



const app = express();
app.use(express.json());

//endpoints below

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewById);
app.patch("/api/reviews/:review_id", updateReviewById);

//error handling below

app.use("/*", (req, res, next) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
    if (err.code === "22P02"){
        res.status(400).send({ msg : "Bad request" });
    } else {
        next(err);
    }
})

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg : err.msg });
  } else {
    next(err);
  }
});



app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;