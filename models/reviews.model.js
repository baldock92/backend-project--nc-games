const { CommandCompleteMessage } = require("pg-protocol/dist/messages");
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

    reviewObj.comment_count = parseInt(reviewObj.comment_count);

    return reviewObj;
  });
};

exports.patchReviewById = (review_id, inc_votes) => {
  if (typeof inc_votes !== "number") {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  let queryStr = `UPDATE reviews SET votes = votes + $2 WHERE review_id = $1 RETURNING *`;

  return db
    .query(queryStr, [review_id, inc_votes])

    .then((data) => {
      if (!data.rows.length) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return data.rows[0];
    });
};

exports.doesCategoryExist = (category) => {
  return db
    .query(
      `SELECT * FROM categories
    WHERE slug = $1`,
      [category]
    )
    .then((data) => {
      if (!data.rows.length) {
        return Promise.reject({ status: 404, msg: "Not found" });
      } else {
        return Promise.resolve();
      }
    });
};

exports.fetchReviews = (
  sort_by = "created_at",
  order = "desc",
  votes,
  review_id,
  title,
  owner,
  category,
  designer,
  created_at
) => {
  const queryVals = [
    "votes",
    "review_id",
    "title",
    "owner",
    "category",
    "designer",
    "created_at",
  ];
  const filteredArr = [];

  let queryStr = `SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, COUNT(comments.review_id) AS comment_count FROM reviews 
  LEFT JOIN comments on comments.review_id = reviews.review_id`;

  if (votes) {
    filteredArr.push(votes);
    queryStr += ` WHERE votes = $${filteredArr.length}`;
  }
  if (review_id) {
    filteredArr.push(review_id);
    queryStr += ` WHERE review_id = $${filteredArr.length}`;
  }
  if (title) {
    filteredArr.push(title);
    queryStr += ` WHERE title = $${filteredArr.length}`;
  }
  if (owner) {
    filteredArr.push(owner);
    queryStr += ` WHERE owner = $${filteredArr.length}`;
  }
  if (category) {
    filteredArr.push(category);
    queryStr += ` WHERE category = $${filteredArr.length}`;
  }
  if (designer) {
    filteredArr.push(designer);
    queryStr += ` WHERE designer = $${filteredArr.length}`;
  }
  if (created_at) {
    filteredArr.push(created_at);
    queryStr += ` WHERE created_at = $${filteredArr.length}`;
  }

  queryStr += ` GROUP BY reviews.review_id`;

  if (queryVals.includes(sort_by)) {
    queryStr += ` ORDER BY ${sort_by}`;
  } else {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  if (order.toUpperCase() === "ASC" || order.toUpperCase() === "DESC") {
    queryStr += ` ${order}`;
  } else {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  return db.query(queryStr, filteredArr).then((data) => {
    const reviewsArr = data.rows;

    reviewsArr.forEach((review) => {
      review.comment_count = parseInt(review.comment_count);
      review.created_at = review.created_at.toISOString();
    });
    return reviewsArr;
  });
};

exports.addReview = (title, designer, owner, review_body, category) => {
  return db
    .query(
      `INSERT INTO reviews (title, designer, owner, review_body, category) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [title, designer, owner, review_body, category]
    )
    .then((data) => {
      data.rows[0].created_at = data.rows[0].created_at.toISOString();
      // console.log(data.rows[0])
      return data.rows[0];
    });
};
// COUNT(comments.review_id) AS comment_count FROM reviews
//   LEFT JOIN comments on comments.review_id = reviews.review_id