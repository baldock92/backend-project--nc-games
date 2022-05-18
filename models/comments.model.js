const db = require("../db/connection");
const { fetchReviewsById} = require("./reviews.model")

exports.getAllReviewsHere = (reviewId) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id=$1`, [reviewId])
    .then((reviewResults) => {
      if (!reviewResults.rows.length) {
        return Promise.reject({ status: 404, msg: "Not found" });
      } else {
        return Promise.resolve();
      }
    });
};

exports.fetchCommentsByReviewId = (reviewId) => {
 
  let queryStr = `SELECT * FROM comments
    WHERE comments.review_id = $1`;

  return db.query(queryStr, [reviewId]).then((data) => {
    let commentsArr = data.rows;

    commentsArr.forEach((comment) => {
      comment.created_at = comment.created_at.toISOString();
    });
   
    return commentsArr;
  });
};
