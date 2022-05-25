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
        return data.rows[0];
    })
}