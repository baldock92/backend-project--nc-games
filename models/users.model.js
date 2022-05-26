const res = require("express/lib/response");
const db = require("../db/connection");

exports.fetchUsers = () => {

    return db.query(`SELECT * FROM users`)
    .then((data) => {
        return data.rows;
    })
}

exports.fetchUserByUsername = (username) => {
    return db.query(`
    SELECT * FROM users WHERE username=$1`, [username])
    .then((data) => {
        if (!data.rows.length){
            return Promise.reject({status: 404, msg: "User not found"})
        }
        return data.rows[0];
    })
}