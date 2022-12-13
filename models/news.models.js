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
};

exports.selectArticleById = articleId => {
  return db.query(`
  SELECT author, title, article_id, body, topic, created_at, votes
  FROM articles WHERE article_id = $1;
  `, [articleId]).then(({rows: article, rowCount}) => 
  rowCount === 0 ? Promise.reject({status: 404, msg: "Article not found."}) : article[0]);
};

exports.selectCommentsByArticle = articleId => {
  return db.query(`
  SELECT comment_id, comments.votes, comments.created_at, comments.author, comments.body 
  FROM comments
  JOIN articles
  ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  ORDER BY comments.created_at DESC;
  `, [articleId]).then(({rows: comments}) => comments);
};