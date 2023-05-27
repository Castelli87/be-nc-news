const db = require("../db/connection");
const { checkIfExists } = require("../db/seeds/utils");

exports.selectCommentsByArticleId = (article_id) => {
  return checkIfExists(article_id).then(() => {
    return db
      .query(
        `SELECT*FROM comments WHERE article_id=$1  ORDER BY created_at DESC;
        `,
        [article_id]
      )
      .then((result) => {
        return result.rows;
      });
  });
};

exports.insertComment = (newComment,article_id) => {
  const { username, body } = newComment;

return checkIfExists(article_id).then(()=>{
  return db
    .query(`INSERT INTO comments (author, body,article_id) VALUES ($1, $2,$3) RETURNING *;`, [
      username,
      body,
      article_id
    ])
    .then(({ rows }) =>rows[0]);

})
};
