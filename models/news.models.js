const db = require('../db/connection');
const fs = require('fs/promises');

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics;`)
  .then(({rows : topics}) => topics);
};

exports.selectArticles = (sort_by = 'created_at' , order = 'DESC', topic) => {  
  const validParameters= ['author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count'];
  
  if(!validParameters.includes(sort_by)) {
    return Promise.reject({status: 400, msg: 'Invalid sort query.'});
  } else if (!/^ASC$|^DESC$/i.test(order)) {
    return Promise.reject({status: 400, msg: 'Invalid order query.'});
  };
  
  let queryString = `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, COUNT(comment_id) ::INTEGER AS comment_count
  FROM articles
  LEFT OUTER JOIN comments
  ON articles.article_id = comments.article_id `;

  const queryParameters = [];
  
  if (topic) {
    queryParameters.push(topic);
    queryString += 'WHERE topic = $1 ';
  };

  queryString += `GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`
  
  return db.query(queryString, queryParameters).then(({rows: articles}) => articles);
};

exports.selectArticleById = articleId => {
  return db.query(`
  SELECT articles.author, title, articles.article_id, articles.body, topic, articles.created_at, articles.votes, COUNT(comments.comment_id) ::INTEGER AS comment_count 
  FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id;
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

exports.insertComment = (newComment, articleId) => {
  return db.query(`
  INSERT INTO comments (body, article_id, author)
  VALUES ($1, $2, $3)
  RETURNING *;
  `, [newComment.body, articleId, newComment.username])
  .then(({rows : updatedComment}) => updatedComment[0]);
};

exports.updateArticleVotes = (articleId, incVotes) => {
  return db.query(`
  UPDATE articles SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *;
  `, [incVotes, articleId])
  .then(({rows : updatedArticle, rowCount}) => 
    rowCount === 0 ? Promise.reject({status: 404, msg: "Article not found."}) 
    : updatedArticle[0]);
};

exports.selectUsers = () => 
  db.query(`SELECT * FROM users;`).then(({rows: users}) => users);

exports.deleteCommentById = commentId => 
  db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [commentId]);

exports.readJSONFile = () =>
  fs.readFile(`${__dirname}/../endpoints.json`, 'utf8').then(endpoints => JSON.parse(endpoints));

exports.selectUserById = username => 
  db.query(`SELECT * FROM users WHERE username = $1;`, [username])
  .then(({rows : users, rowCount}) => 
  rowCount === 0 ? Promise.reject({status: 404, msg : "Username not found."}) : users[0]);

exports.updateCommentVotes = (commentId, incVotes) => {
  return db.query(`
  UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;
  `, [incVotes, commentId])
  .then(({rows: comment, rowCount}) =>
  rowCount === 0 ? Promise.reject({status: 404, msg: "Comment not found."}) : comment[0]);
};

exports.insertArticle = article => {
  const { author, title, body, topic } = article;
  return db.query(`
  INSERT INTO articles (title, topic, author, body) 
  VALUES ($1, $2, $3, $4) RETURNING *;
  `, [title, topic, author, body])
  .then(({rows : article}) => {
    article[0].comment_count = 0;
    return article[0];
  });
};

