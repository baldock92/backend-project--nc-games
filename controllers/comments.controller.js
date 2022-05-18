const {
  fetchCommentsByReviewId,
  getAllReviewsHere,
  addCommentByReviewId,
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
    console.log(req.body)
    
  if (
    req.body.hasOwnProperty("username") === false || 
    req.body.hasOwnProperty("body") === false
  ) {
    res.status(400).send({ msg: "Mandatory field missing" });
  }

  addCommentByReviewId(review_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
