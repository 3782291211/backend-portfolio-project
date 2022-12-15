const {selectTopics, selectArticles, selectArticleById, selectCommentsByArticle, insertComment, updateArticleVotes, selectUsers, deleteCommentById, readJSONFile, selectUserById, updateCommentVotes, insertArticle, insertTopic, deleteArticleById} = require('../models/news.models');
const {checkValueExists} = require('../models/utility-queries.models');

exports.getTopics = (req, res, next) => {
  selectTopics().then(topics => res.status(200).send({topics}))
  .catch(err => next(err));
};

exports.getArticles = (req, res, next) => {
  const { sort_by , order , limit , page , topic } = req.query;
  return Promise.all([
     selectArticles(sort_by, order, limit, page, topic),
     checkValueExists('slug', 'topics', req.query.topic)
  ]).then(([articles]) => {
    res.status(200).send(articles);
  }).catch(err => next(err));
};

exports.getArticleById = (req, res, next) => {
  selectArticleById(req.params.article_id)
  .then(article => res.status(200).send({article}))
  .catch(err => next(err));
};

exports.getCommentsByArticle = (req, res, next) => {
  const { article_id } = req.params; 
  const { limit, page } = req.query;
  return Promise.all([
    selectCommentsByArticle(article_id, limit, page),
    checkValueExists('article_id', 'articles', article_id)
  ])
  .then(([comments]) => res.status(200).send({comments}))
  .catch(err => next(err));
};

exports.postComment = (req, res, next) => {
  insertComment(req.body, req.params.article_id)
  .then(comment => res.status(201).send({comment}))
  .catch(err => next(err));
};

exports.patchArticleVotes = (req, res, next) => {
  const { article_id} = req.params;
  updateArticleVotes(article_id, req.body.inc_votes)
  .then(article => res.status(200).send({article}))
  .catch(err => next(err));
};

exports.getUsers = (req, res, next) => {
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

exports.getJSONendpoints = (req, res, next) => {
  readJSONFile()
  .then(endpoints => res.status(200).send(endpoints))
  .catch(err => next(err));
};

exports.getUserById = (req, res, next) => {
  const { username } = req.params;
  selectUserById(username)
  .then(user => res.status(200).send({user}))
  .catch(err => next(err));
}

exports.patchCommentVotes = (req, res, next) => {
  const {comment_id} = req.params;
  const incVotes = req.body.inc_votes;

  return Promise.all([
    checkValueExists('comment_id', 'comments', comment_id),
    updateCommentVotes(comment_id, incVotes)
  ]).then(([prom1, comment]) => res.status(200).send({comment}))
  .catch(err => next(err));
};

exports.postArticle = (req, res, next) => {
  insertArticle(req.body)
  .then(article => res.status(201).send({article}))
  .catch(err => next(err));
};

exports.postTopic = (req, res, next) => {
  const { slug , description } = req.body;
  insertTopic(slug, description)
  .then(topic => res.status(201).send({topic}))
  .catch(err => next(err));
};

exports.deleteArticle = (req, res, next) => {
  const { article_id } = req.params;
  return Promise.all([
    checkValueExists('article_id', 'articles', article_id),
    deleteArticleById(article_id)
  ])
  .then(() => res.sendStatus(204))
  .catch(err =>next(err));
};