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
