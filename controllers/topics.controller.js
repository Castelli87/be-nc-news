const { selectTopics } = require("../models/topics.model");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((result) => {

      res.status(200).send({ topics: result.rows });
    })
};
