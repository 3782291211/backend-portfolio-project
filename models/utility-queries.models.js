const db = require('../db/connection');
const format = require('pg-format');

exports.checkIdExists = articleId => {
  return db.query(`SELECT article_id FROM articles WHERE article_id = $1;`, [articleId])
    .then(({rowCount}) => {
      if (rowCount === 0) {
        return Promise.reject({status: 404, msg: 'Article not found.'});
      }
    });
};

exports.checkTopicExists = topic =>{
  if (topic) {
    return db.query(`SELECT slug FROM topics WHERE slug = $1;`, [topic])
    .then(({rowCount}) => {
      if(rowCount === 0) {
        return Promise.reject({status: 404, msg : 'Topic not found.'});
      }
    })
  }
};