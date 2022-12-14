const db = require('../db/connection');
const format = require('pg-format');

exports.checkValueExists = (column, table, value) => {
  if(value) {
    const queryString = format('SELECT %I FROM %I WHERE %I = $1;', column, table, column);
    return db.query(queryString, [value])
    .then(({rowCount}) => {
      if(rowCount === 0) {
        return Promise.reject({status: 404, msg : 'Resource not found.'});
      }
    })
  }
};