const {selectTopics, selectArticles} = require('../models/news-models');

exports.getTopics = (req, res, next) => {
  selectTopics().then(topics => res.status(200).send({topics}))
  .catch(err => next(err));
}

exports.getArticles = (req, res, next) => {
  selectArticles().then(articles => res.status(200).send({articles}))
  .catch(err => next(err));
}