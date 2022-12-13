const {selectTopics, selectArticles, selectArticleById} = require('../models/news-models');

exports.getTopics = (req, res, next) => {
  selectTopics().then(topics => res.status(200).send({topics}))
  .catch(err => next(err));
};

exports.getArticles = (req, res, next) => {
  selectArticles().then(articles => res.status(200).send({articles}))
  .catch(err => next(err));
}

exports.getArticleById = (req, res, next) => {
  selectArticleById(req.params.article_id)
  .then(article => res.status(200).send({article}))
  .catch(err => next(err));
};