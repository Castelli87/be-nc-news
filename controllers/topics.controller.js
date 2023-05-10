const { selectTopics,
        fetchApi } = require("../models/topics.model");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((result) => {

      res.status(200).send({ topics: result.rows });
    })
};

/* exports.getEndpoints=(req,res)=>{
  selectEndpoints().then((result)=>{
    res.status(200).send(result)
  })
}
 */
exports.getApi = (req, res, next) => {
  fetchApi().then((result) => {
      res.status(200).send({ result });
  })
  .catch((err) => {
      next(err);
  })}
