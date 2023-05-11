\c nc_news_test;

SELECT * FROM articles ;
--SELECT articles.author,articles.title,articles.article_id,articles.topic,articles.created_at,articles.votes,articles.article_img_urlFROM articles,comments.article_id FROM articles JOIN articles.article_id=comments.article_id;

SELECT articles.author,articles.title,articles.article_id,articles.topic,articles.created_at,articles.votes,articles.article_img_url,
COUNT(comments.comment_id) as comment_count
FROM articles
JOIN comments
ON comments.article_id=articles.article_id
GROUP BY articles.article_id
ORDER BY created_at DESC;