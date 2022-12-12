\c nc_news_test;

\echo '\n \n topics \n'
SELECT * FROM topics LIMIT 10;

\echo '\n \n users \n'
SELECT username, name FROM users LIMIT 10;

\echo '\n \n articles \n'
SELECT article_id, title, topic, author, created_at, votes FROM articles;

\echo '\n \n comments \n'
SELECT comment_id, article_id, author, votes, created_at FROM comments;


\echo '\n \n articles with comment count \n'

SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, COUNT(comment_id) AS comment_count
FROM articles
LEFT OUTER JOIN comments
ON articles.article_id = comments.article_id
GROUP BY articles.article_id
ORDER BY articles.created_at ASC;