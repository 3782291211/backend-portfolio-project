\c nc_news;

\echo '\n \n Use this file to pipe query output data into a .txt file for easy viewing. \n'

\echo '\n \n Show all topics - even those not referenced by any articles \n'
/*SELECT slug, description, COUNT(articles.article_id) 
AS number_of_articles 
FROM topics
LEFT JOIN articles
ON topics.slug LIKE articles.topic
GROUP BY slug;

SELECT comment_id, comments.votes, comments.created_at, comments.author, comments.body, avatar_url FROM comments 
JOIN users 
ON comments.author LIKE users.username
ORDER BY created_at DESC;

SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, COUNT(comment_id) ::INTEGER AS comment_count 
  FROM articles
  JOIN users
  ON articles.author = users.username
  LEFT OUTER JOIN comments
  ON articles.article_id = comments.article_id
  WHERE topic = 'mitch'
  GROUP BY articles.article_id ORDER BY topic DESC LIMIT 50 OFFSET 0;

  SELECT articles.author, avatar_url, title, articles.article_id, topic, articles.created_at, articles.votes, COUNT(comment_id) ::INTEGER AS comment_count 
  FROM articles
  JOIN users
  ON articles.author = users.username
  LEFT OUTER JOIN comments
  ON articles.article_id = comments.article_id
  WHERE topic = 'mitch'
  GROUP BY articles.article_id, avatar_url ORDER BY topic DESC LIMIT 50 OFFSET 0;*/


  SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, COUNT(comment_id) ::INTEGER AS comment_count, avatar_url
  FROM articles
  JOIN users
  ON articles.author = users.username
  LEFT OUTER JOIN comments
  ON articles.article_id = comments.article_id
  WHERE topic = 'coding' AND articles.author = 'tickle122'
  GROUP BY articles.article_id, avatar_url ORDER BY author ASC LIMIT 50 OFFSET 0;