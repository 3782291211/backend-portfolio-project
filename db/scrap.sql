\c nc_news;

\echo '\n \n topics \n'
SELECT * FROM topics LIMIT 10;

\echo '\n \n users \n'
SELECT username, name FROM users LIMIT 10;

\echo '\n \n articles \n'
SELECT article_id, title, topic, author, created_at, votes FROM articles LIMIT 10;

\echo '\n \n comments \n'
SELECT comment_id, article_id, author, votes, created_at FROM comments LIMIT 10;


\echo '\n \n articles with comment count AND LIMIT \n'

SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, COUNT(comment_id) AS comment_count
FROM articles
LEFT OUTER JOIN comments
ON articles.article_id = comments.article_id
GROUP BY articles.article_id
ORDER BY articles.created_at ASC
LIMIT 10;


\echo '\n \n Insert article \n'

INSERT INTO articles (title, topic, author, body) 
VALUES ('Welcome to Fat City', 'coding', 'grumpy19', 'Wow oh wow') RETURNING *;

