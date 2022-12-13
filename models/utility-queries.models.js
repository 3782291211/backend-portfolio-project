const db = require('../db/connection');

exports.checkIdExists = articleId => {
  return db.query(`SELECT article_id FROM articles WHERE article_id = $1`, [articleId])
    .then(({rowCount}) => {
      if (rowCount === 0) {
        return Promise.reject({status: 404, msg: 'Article not found.'});
      }
    });
};
