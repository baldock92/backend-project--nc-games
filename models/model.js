const db = require("../db/connection");
//const {convertTimestampToDate, createRef, formatComments} = require("../db/seeds/utils")

exports.fetchCategories = () => {
  let queryStr = `SELECT * FROM categories`;

  return db.query(queryStr).then((results) => {
    if (!results.rows.length) {
      return Promise.reject({ status: 404, msg: "Route not found" });
    }
    
    return results.rows;
  });
};
