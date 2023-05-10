
const {selectArticleById}=require('../models/article.model')

exports.getArticleById= (req, res, next) => {
    const article_id = req.params.article_id
    selectArticleById(article_id).then((result)=>{
        res.status(200).send({ article: result})
    }).catch((err)=>{
        next(err)
    })
}