const {selectTopics, selectArticles, selectArticleById, selectCommentsByArticle, insertComment, updateArticleVotes, selectUsers, deleteCommentById} = require('../models/news.models');
const {checkValueExists} = require('../models/utility-queries.models');

exports.getTopics = (req, res, next) => {
  selectTopics().then(topics => res.status(200).send({topics}))
  .catch(err => next(err));
};

exports.getArticles = (req, res, next) => {
  const { sort_by , order , topic } = req.query;
  return Promise.all([
     selectArticles(sort_by, order, topic),
     checkValueExists('slug', 'topics', req.query.topic)
  ]).then(([articles]) => {
    res.status(200).send({articles});
  }).catch(err => next(err));
};

exports.getArticleById = (req, res, next) => {
  selectArticleById(req.params.article_id)
  .then(article => res.status(200).send({article}))
  .catch(err => next(err));
};

exports.getCommentsByArticle = (req, res, next) => {
  const { article_id } = req.params; 
  return Promise.all([
    selectCommentsByArticle(article_id),
    checkValueExists('article_id', 'articles', article_id)
  ])
  .then(([comments]) => res.status(200).send({comments}))
  .catch(err => next(err));
};

exports.postComment = (req, res, next) => {
  insertComment(req.body, req.params.article_id)
  .then(newComment => res.status(201).send({"new_comment": newComment}))
  .catch(err => next(err));
};

exports.patchArticleVotes = (req, res, next) => {
  updateArticleVotes(req.params.article_id, req.body.inc_votes)
  .then(article => res.status(200).send({article}))
  .catch(err => next(err));
};

exports.getUsers = (req, res) => {
  selectUsers()
  .then(users => res.status(200).send({users}))
  .catch(err => next(err));
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
return Promise.all ([
  checkValueExists('comment_id', 'comments', comment_id),
  deleteCommentById(comment_id)
])
.then(() => res.sendStatus(204))
.catch(err => next(err));
};
