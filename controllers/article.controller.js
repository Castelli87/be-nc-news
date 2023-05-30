
const {selectArticleById,selectArticles,updataVotesById}=require('../models/article.model')



exports.getArticleById= (req, res, next) => {
    const article_id = req.params.article_id
    selectArticleById(article_id).then((result)=>{
        res.status(200).send({ article: result})
    }).catch((err)=>{
        next(err)
    })
}

exports.getArticles = (req, res, next) => {

    selectArticles()
      .then((result) => {
  
        res.status(200).send({ articles: result});
      }).catch((err)=>{
        next(err)
      })
  };

exports.selectVotesById = (req,res,next)=>{

const article_id=req.params.article_id
const propertyToUpdate = req.body
/*  console.log(Object.keys(propertyToUpdate).length) */
updataVotesById(article_id,propertyToUpdate).then((result)=>{
  res.status(200).send({article:result})
}).catch((err)=>{
/*   console.log(err) */
  next(err)
})
}