\c nc_news_test;
/*
\echo '\n \n topics \n'
SELECT * FROM topics;

\echo '\n \n users \n'
SELECT username, name FROM users LIMIT 10;

\echo '\n \n articles \n'
SELECT article_id, title, topic, author, created_at, votes FROM articles LIMIT 10;

\echo '\n \n comments \n'
SELECT comment_id, article_id, author, votes, created_at FROM comments LIMIT 10;
*/

\echo '\n \n articles with comment count AND LIMIT \n'

SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, COUNT(comment_id) AS comment_count
FROM articles
LEFT OUTER JOIN comments
ON articles.article_id = comments.article_id
GROUP BY articles.article_id
ORDER BY articles.created_at ASC
LIMIT 10;


SELECT * FROM articles;

\echo '\n \n Comments for article 2 \n'
SELECT * FROM comments;

\echo '\n \n comments for article 36 \n'
--SELECT * FROM comments WHERE article_id = 36;

\echo '\n \n DELETE article \n'

--DELETE FROM articles WHERE article_id = 36 RETURNING*;