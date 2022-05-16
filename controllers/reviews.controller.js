const { fetchReviewById } = require("../models/reviews.model");

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  console.log(review_id)

  fetchReviewById(review_id).then((review) => {
    res.status(200).send({ review });
  })
  .catch((err) => {
      next(err);
  })
};
