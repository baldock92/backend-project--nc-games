const { fetchCommentsByReviewId, getAllReviewsHere } = require("../models/comments.model");


exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
     const promises = [getAllReviewsHere(review_id), fetchCommentsByReviewId(review_id)]
    


  return Promise.all(promises)
    .then(([irrelevant ,comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
