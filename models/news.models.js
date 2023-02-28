const db = require('../db/connection');
const fs = require('fs/promises');

exports.selectTopics = () => {
  return db.query(`SELECT topic_id, slug, description, COUNT(articles.article_id) ::INTEGER
  AS number_of_articles 
  FROM topics
  LEFT JOIN articles
  ON topics.slug LIKE articles.topic
  GROUP BY slug;`)
  .then(({rows : topics}) => topics);
};


exports.selectArticles = (sort_by = 'created_at', order = 'DESC', limit = 10, page = 1, topic, author) => {  
  const validParameters= ['author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count'];
  if(!validParameters.includes(sort_by)) {
    return Promise.reject({status: 400, msg: 'Invalid sort query.'});
  } else if (!/^ASC$|^DESC$/i.test(order)) {
    return Promise.reject({status: 400, msg: 'Invalid order query.'});
  };
  
  let queryString = `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, COUNT(comment_id) ::INTEGER AS comment_count, avatar_url
  FROM articles
  JOIN users
  ON articles.author = users.username
  LEFT OUTER JOIN comments
  ON articles.article_id = comments.article_id `;

  let queryParameters = [limit, limit * (page - 1)];
  
  if (topic && !author || !topic && author) {
    queryParameters.push(topic || author);
    queryString += `WHERE ${topic && 'topic' || author && 'articles.author'} = $3 `;
  } else if (topic && author) {
    queryParameters = [...queryParameters, topic, author];
    queryString += 'WHERE topic = $3 AND articles.author = $4 '
  };

  queryString += `GROUP BY articles.article_id, avatar_url ORDER BY ${sort_by} ${order} LIMIT $1 OFFSET $2;`
  
  return db.query(queryString, queryParameters).then(({rows, rowCount}) => {
    return {articles: rows, total_count: rowCount, page: page, page_limit: parseInt(limit)};
  });
};


exports.selectArticleById = articleId => {
  return db.query(`
  SELECT articles.author, title, articles.article_id, articles.body, topic, articles.created_at, articles.votes, COUNT(comments.comment_id) ::INTEGER AS comment_count, avatar_url 
  FROM articles
  JOIN users
  ON articles.author = users.username
  LEFT JOIN comments
  ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id, avatar_url;
  `, [articleId]).then(({rows: article, rowCount}) => 
  rowCount === 0 ? Promise.reject({status: 404, msg: "Article not found."}) : article[0]);
};


exports.selectCommentsByArticle = (articleId, limit = 10, page = 1) => {
  return db.query(`
  SELECT comment_id, comments.votes, comments.created_at, comments.author, comments.body, avatar_url 
  FROM comments
  JOIN users
  ON comments.author = users.username
  JOIN articles
  ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  ORDER BY comments.created_at DESC LIMIT $2 OFFSET $3;
  `, [articleId, limit, limit * (page - 1)]).then(({rows: comments}) => comments);
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
  db.query(`SELECT username, name, avatar_url FROM users;`).then(({rows: users}) => users);


exports.deleteCommentById = commentId => 
  db.query(`DELETE FROM comments WHERE comment_id = $1;`, [commentId]);


exports.readJSONFile = () =>
  fs.readFile(`${__dirname}/../endpoints.json`, 'utf8').then(endpoints => JSON.parse(endpoints));


exports.selectUserById = username => 
  db.query(`SELECT username, name, avatar_url FROM users WHERE username = $1;`, [username])
  .then(({rows : users, rowCount}) => 
  rowCount === 0 ? Promise.reject({status: 404, msg : "Username not found."}) : users[0]);


exports.insertUser = (username, password, name, avatar_url) => {
  return db.query(`
  INSERT INTO users (username, password, name, avatar_url)
  VALUES ($1, $2, $3, $4) RETURNING username, name, avatar_url;
  `, [username, password, name, avatar_url])
  .then(({rows: user}) => user[0]);
}

exports.updateUser = (currentUsername, newUsername, password, name, avatar_url) => {
  return db.query(`
  UPDATE users
  SET 
      username = COALESCE($2, username),
      password = COALESCE($3, password),
      name = COALESCE($4, name),
      avatar_url = COALESCE($5, avatar_url)
  WHERE username = $1 RETURNING *;
  `, [currentUsername, newUsername, password, name, avatar_url])
  .then(({rows: user}) => user[0]);
};


exports.loginUser = username => 
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

exports.insertTopic = (slug, description) => {
  return db.query(`
    INSERT INTO topics (slug, description)
    VALUES ($1, $2)
    RETURNING *;`, [slug, description])
    .then(({rows: topic}) => topic[0]);
};

exports.deleteArticleById = articleId => 
  db.query(`DELETE FROM articles WHERE article_id = $1;`, [articleId]);

exports.deleteTopicByName = topic => {
  return db.query('SELECT * FROM articles WHERE topic LIKE $1;', [topic])
  .then(({rowCount}) => {
    if (rowCount !== 0) {
      return Promise.reject({status: 400, msg: "Unable to delete. Topic is associated with existing articles on this site."});
    };
  })
  .then(() => db.query('DELETE FROM topics WHERE slug = $1;', [topic]));
};

exports.selectAllComments = (limit, page) => {
  return db.query(`SELECT comment_id, comments.votes, comments.created_at, comments.author, comments.body, articles.article_id, articles.title AS article, avatar_url 
  FROM comments 
  JOIN articles
  ON comments.article_id = articles.article_id
  JOIN users 
  ON comments.author LIKE users.username
  ORDER BY created_at DESC LIMIT $1 OFFSET $2;`, [limit, limit * (page - 1)])
  .then(({rows : comments}) => comments);
};