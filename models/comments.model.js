const db = require("../db/connection");
const { fetchReviewsById } = require("./reviews.model");

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

exports.addCommentByReviewId = (reviewId, username, body) => {
  return db
    .query(
      `INSERT INTO comments (review_id, author, body) VALUES ($1, $2, $3) RETURNING *`,
      [reviewId, username, body]
    )
    .then((data) => {
      const comment = data.rows[0];
      comment.created_at = comment.created_at.toISOString();

      return data.rows[0];
    });
};

exports.deleteCommentById = (commentId) => {
  return db.query(`DELETE FROM comments WHERE comment_id = $1`, [commentId]);
};

exports.doesCommentIdExist = (commentId) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [commentId])
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({ status: 404, msg: "Not found" });
      } else {
        Promise.resolve();
      }
    });
};
