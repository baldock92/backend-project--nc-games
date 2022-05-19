const express = require("express");

const { getCategories } = require("./controllers/categories.controller");
const {
  getReviewById,
  updateReviewById,
  getReviews,
} = require("./controllers/reviews.controller");
const { getUsers } = require("./controllers/users.controller");
const {
  getCommentsByReviewId,
  postCommentByReviewId,
} = require("./controllers/comments.controller");

const app = express();
app.use(express.json());

//endpoints below

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewById);
app.patch("/api/reviews/:review_id", updateReviewById);
app.get("/api/users", getUsers);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);
app.post("/api/reviews/:review_id/comments", postCommentByReviewId);

//error handling below

app.use("/*", (req, res, next) => {
  res.status(404).send({ msg: "Not found" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ msg: "User not found" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err, "err here in 500 handler");
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
