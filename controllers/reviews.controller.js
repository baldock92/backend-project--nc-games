const { fetchReviewById, patchReviewById } = require("../models/reviews.model");

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;

  fetchReviewById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateReviewById = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;

  patchReviewById(review_id, inc_votes)
    .then((updatedReview) => {
      res.status(201).send({ updatedReview });
    })
    .catch((err) => {
      next(err);
    });
};