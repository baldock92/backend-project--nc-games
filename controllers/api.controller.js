const fs = require("fs/promises");

exports.getEndpoints = (req, res, next) => {
  return fs
    .readFile(`./endpoints.json`, "utf8")
    .then((endpointData) => {
      const parsedEndpoints = JSON.parse(endpointData);

      return parsedEndpoints;
    })
    .then((data) => {
      res.status(200).send({ data });
    })
    .catch((err) => {
      console.log(err);
    });
};
