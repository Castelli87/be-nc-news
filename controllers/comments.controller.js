const {selectCommentsByArticleId}=require('../models/comments.model')

exports.getCommentsByArticleId=(req,res,next)=>{
    const article_id = req.params.article_id
    
    selectCommentsByArticleId(article_id).then((result)=>{
     
        res.status(200).send({commentsByArticleId:result})
    }).catch((err)=>{
        next(err)
    })
}