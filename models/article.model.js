const db =require('../db/connection')


exports.selectArticleById = (article_id) => {
    return db
    .query(`SELECT*FROM articles WHERE article_id=$1`,[article_id])
    .then((result)=>{
       
        if (result.rows.length === 0){
            return Promise.reject({status:404, msg:'not found'})
        }
        return result.rows[0]
    })

}

exports.selectArticles = ()=>{
 
    return db.query(`
    SELECT 
    articles.author, 
    articles.title, 
    articles.article_id, 
    articles.topic, 
    articles.created_at, 
    articles.votes, 
    articles.article_img_url,

    COUNT(*)::INT AS comment_count
    FROM articles

    JOIN comments ON comments.article_id = articles.article_id

    GROUP BY articles.article_id

    ORDER BY articles.created_at DESC;
    `).then((result)=>{
     
        return result.rows
    })
}

exports.updataVotesById=(article_id,propertyToUpdate)=>{
    const {inc_votes}=propertyToUpdate
    console.log(inc_votes,article_id,'in the model ')
    return db.query(
        `
        UPDATE  articles
        SET
        votes = votes +$1
        WHERE 
        article_id = $2
        RETURNING *;`,[inc_votes,article_id]
        
    ).then((result)=>{
        //console.log(result.rows[0])
        return result.rows[0]
    })
}