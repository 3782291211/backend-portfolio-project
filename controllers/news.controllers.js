const {selectTopics, selectArticles, selectArticleById, selectCommentsByArticle} = require('../models/news.models');
const {checkIdExists} = require('../models/utility-queries.models');

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

exports.getCommentsByArticle = (req, res, next) => {
  const { article_id } = req.params; 
  return Promise.all([
    selectCommentsByArticle(article_id),
    checkIdExists(article_id)
  ])
  .then(([comments]) => res.status(200).send({comments}))
  .catch(err => next(err));
};