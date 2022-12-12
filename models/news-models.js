const db = require('../db/connection');

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics;`)
  .then(({rows : topics}) => topics);
};

exports.selectArticles = () => {
  return db.query(`
  SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, COUNT(comment_id) ::INTEGER AS comment_count
  FROM articles
  LEFT OUTER JOIN comments
  ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC;
  `).then(({rows: articles}) => articles);
}