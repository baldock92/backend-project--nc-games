const res = require("express/lib/response");
const {
  fetchReviewById,
  patchReviewById,
  fetchReviews,
  doesCategoryExist,
} = require("../models/reviews.model");

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
      res.status(200).send({ updatedReview });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviews = (req, res, next) => {
  const {
    sort_by,
    order,
    votes,
    review_id,
    title,
    owner,
    category,
    designer,
    created_at,
  } = req.query;

  const promises = [
    fetchReviews(
      sort_by,
      order,
      votes,
      review_id,
      title,
      owner,
      category,
      designer,
      created_at
    ),
  ];

  if (category) {
    promises.push(doesCategoryExist(category));
  }

  return Promise.all(promises)
    .then(([reviews]) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};
