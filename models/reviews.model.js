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
