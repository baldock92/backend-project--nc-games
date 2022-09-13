const { fetchCategories, addCategory } = require("../models/categories.model");

exports.getCategories = (req, res, next) => {
  fetchCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCategory = (req, res, next) => {
  const {slug, description} = req.body;

  if (!req.body.hasOwnProperty("slug") || !req.body.hasOwnProperty("description") ){
    res.status(400).send({msg: "Bad request - Field missing"})
  }

  addCategory(slug, description)
  .then((returnedCategory) => {
    res.status(201).send(returnedCategory)
  })
  .catch((err) => {
    next(err)
  })
}
