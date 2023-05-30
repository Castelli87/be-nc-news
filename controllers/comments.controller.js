const { response } = require("../app");
const {
  selectCommentsByArticleId,
  insertComment,
} = require("../models/comments.model");

exports.getCommentsByArticleId = (req, res, next) => {
  const article_id = req.params.article_id;

  selectCommentsByArticleId(article_id)
    .then((result) => {
      res.status(200).send({ commentsByArticleId: result });
    })
    .catch((err) => {
      next(err);
    });
};

exports.addComment = (req, res, next) => {
  const newComment = req.body;

  const article_id=req.params.article_id

  insertComment(newComment,article_id).then((result) => {
 
    res.status(201).send({comment:result});
  }).catch((err)=>{

    next(err)
  })
};
