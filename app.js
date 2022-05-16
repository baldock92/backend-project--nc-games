const express = require("express");

const { getCategories } = require("./controllers/categories.controller");

const app = express();
app.use(express.json());

//endpoints below

app.get("/api/categories", getCategories);



//error handling below
app.use("/*", (req, res, next) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
