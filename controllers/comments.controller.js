const {
  fetchCommentsByReviewId,
  getAllReviewsHere,
  addCommentByReviewId,
  deleteCommentById,
} = require("../models/comments.model");

exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  const promises = [
    getAllReviewsHere(review_id),
    fetchCommentsByReviewId(review_id),
  ];

  return Promise.all(promises)
    .then(([irrelevant, comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  const { username, body } = req.body;

  if (
    req.body.hasOwnProperty("username") === false ||
    req.body.hasOwnProperty("body") === false
  ) {
    res.status(400).send({ msg: "Mandatory field missing" });
  }

  const promises = [
    getAllReviewsHere(review_id),
    addCommentByReviewId(review_id, username, body),
  ];

  return Promise.all(promises)
    .then(([_, comment]) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.removeCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  deleteCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
