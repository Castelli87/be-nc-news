const { selectTopics } = require("../models/topics.model");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((result) => {
      console.log(result.rows);
      res.status(200).send({ topics: result.rows });
    })
};
