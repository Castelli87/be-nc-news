
const {selectArticleById,selectArticles}=require('../models/article.model')



exports.getArticleById= (req, res, next) => {
    const article_id = req.params.article_id
    selectArticleById(article_id).then((result)=>{
        res.status(200).send({ article: result})
    }).catch((err)=>{
        next(err)
    })
}

exports.getArticles = (req, res, next) => {
    //console.log('in the controller')
    selectArticles()
      .then((result) => {
  
        res.status(200).send({ articles: result});
      }).catch((err)=>{
        next(err)
      })
  };