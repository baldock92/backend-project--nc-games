const express = require("express");

const { getCategories, postCategory } = require("./controllers/categories.controller");
const {
  getReviewById,
  updateReviewById,
  getReviews,
  postReview,
} = require("./controllers/reviews.controller");
const {
  getUsers,
  getUserByUsername,
} = require("./controllers/users.controller");
const {
  getCommentsByReviewId,
  postCommentByReviewId,
  removeCommentById,
  updateCommentById,
} = require("./controllers/comments.controller");
const { getEndpoints } = require("./controllers/api.controller");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

//endpoints below

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewById);
app.patch("/api/reviews/:review_id", updateReviewById);
app.get("/api/users", getUsers);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);
app.post("/api/reviews/:review_id/comments", postCommentByReviewId);
app.delete("/api/comments/:comment_id", removeCommentById);
app.get("/api", getEndpoints);
app.get("/api/users/:username", getUserByUsername);
app.patch("/api/comments/:comment_id", updateCommentById);
app.post("/api/reviews", postReview);
app.post("/api/categories", postCategory)
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
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
