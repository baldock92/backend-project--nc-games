const db = require("../db/connection");

exports.fetchReviewById = (review_id) => {
  let queryStr = `SELECT review_id, title, review_body, designer, review_img_url, votes, category, owner, created_at FROM reviews
  WHERE review_id =$1`;

  return db.query(queryStr, [review_id]).then((data) => {
    if (!data.rows.length) {
      return Promise.reject({ status: 404, msg: "Route not found" });
    }
    return data.rows[0];
  });
};
