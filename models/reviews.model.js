const db = require("../db/connection");

exports.fetchReviewById = (reviewId) => {
  
 
  let queryStr = `SELECT reviews.*, COUNT(comments.review_id) AS comment_count FROM reviews
  LEFT JOIN comments on comments.review_id = reviews.review_id
  WHERE reviews.review_id = $1
  GROUP BY reviews.review_id`;

  return db.query(queryStr, [reviewId]).then((data) => {
    if (!data.rows.length) {
      return Promise.reject({ status: 404, msg: "Route not found" });
    }
    const reviewObj = data.rows[0];

    reviewObj.comment_count = parseInt(reviewObj.comment_count)
    
    return reviewObj;
  });
};





exports.patchReviewById = (review_id, inc_votes) => {

  if(typeof inc_votes !== "number"){
    return Promise.reject({status : 400, msg : "Bad request"})
  }
  
  
  let queryStr = `UPDATE reviews SET votes = votes + $2 WHERE review_id = $1 RETURNING *`;

  return db
    .query(queryStr, [review_id, inc_votes])

    .then((data) => {
      if (!data.rows.length){
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return data.rows[0];
    });
};
