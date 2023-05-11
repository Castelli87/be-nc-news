const {selectCommentsByArticleId}=require('../models/comments.model')

exports.getCommentsByArticleId=(req,res,next)=>{
    const article_id = req.params.article_id
    console.log(article_id,'<<<<<<<<controller')
    selectCommentsByArticleId()
}