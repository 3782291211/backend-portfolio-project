const {selectTopics, selectArticles, selectArticleById, selectCommentsByArticle, insertComment, updateArticleVotes, selectUsers, deleteCommentById, readJSONFile, selectUserById, updateCommentVotes, insertArticle, insertTopic, deleteArticleById, deleteTopicByName, selectAllComments, insertUser, loginUser, updateUser, deleteUser} = require('../models/news.models');
const {checkValueExists} = require('../models/utility-queries.models');
const bcrypt = require('bcrypt');

exports.getTopics = (req, res, next) => {
  selectTopics().then(topics => res.status(200).send({topics}))
  .catch(err => next(err));
};

exports.getArticles = (req, res, next) => {
  const { sort_by , order , limit , page , topic, author } = req.query;
  return Promise.all([
     selectArticles(sort_by, order, limit, page, topic, author),
     topic && checkValueExists('slug', 'topics', topic),
     author && checkValueExists('username', 'users', author)
  ])
  .then(([articles]) => {
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
};

exports.patchCommentVotes = (req, res, next) => {
  const {comment_id} = req.params;
  const incVotes = req.body.inc_votes;
  updateCommentVotes(comment_id, incVotes)
  .then(comment => res.status(200).send({comment}))
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

exports.deleteTopic = (req, res, next) => {
  const { topic } = req.params;
  return Promise.all([
    checkValueExists('slug', 'topics', topic),
    deleteTopicByName(topic)
  ])
  .then(() => res.sendStatus(204))
  .catch(err => next(err));
};

exports.getComments = (req, res, next) => {
  const { limit = 50, page = 1 } = req.query;
  selectAllComments(limit, page).then(comments => res.status(200).send({comments}))
  .catch(err => next(err));
};

exports.showWelcomeMessage = (req, res, next) => {
 return Promise.resolve(res.status(200).send(
  {msg : "To see list of available endpoints, append /api to URL."}))
  .catch(err => next(err));
};

exports.login = (req, res, next) => {
  const {username, password: loginPassword} = req.body;
  loginUser(username)
  .then(({password: correctPassword}) => {
    return bcrypt.compare(loginPassword, correctPassword);
  })
  .then(isCorrectPassword => {
    return isCorrectPassword ? res.status(200).send({msg: "Successfully logged in."})
    : res.status(400).send({msg: "Incorrect password."});
  })
  .catch(err => {
    next(err);
  })

};

exports.signup = (req, res, next) => {
  const {username, password, name, avatar_url = null} = req.body;
  if (!password) {
    res.status(400).send({msg: "Password is required."});
  } else if (!username) {
    res.status(400).send({msg: "Username is required."});
  } else if (!name) {
    res.status(400).send({msg: "Name is required."});
  } else {
  bcrypt.hash(password, 10)
  .then(hashedPassword => {
    return hashedPassword;
  })
  .then(hashedPassword => {
    return insertUser(username, hashedPassword, name, avatar_url)
  })
  .then(user => res.status(201).send({newUser: user}))
  .catch(err => next(err));
};
};

exports.patchUser = (req, res, next) => {
  const {username: currentUsername} = req.params;
  const {username: newUsername = null, password = null, name = null, avatar_url = null} = req.body;

  for (const key in req.body) {
    if (/^\s+$/.test(req.body[key])) {
      res.status(400).send({msg: "Field cannot be a whitespace."});
      return;
    } else if (!req.body[key]) {
      res.status(400).send({msg: "Field cannot be empty."});
      return;
    };
  };

  if (password) {
    bcrypt.hash(password, 10)
    .then(hashedPassword => {
      return hashedPassword;
    })
    .then(hashedPassword => {
      return updateUser(currentUsername, newUsername, hashedPassword, name, avatar_url);
    })
    .then(user => res.status(200).send({user}))
    .catch(err => next(err));
  } else {
    updateUser(currentUsername, newUsername, password, name, avatar_url)
    .then(user => res.status(200).send({user}))
    .catch(err => next(err));
  };
};

exports.deleteAccount = (req, res, next) => {
  const { username } = req.params;
  return Promise.all([
    checkValueExists('username', 'users', username),
    deleteUser(username)
  ])
  .then(() => res.sendStatus(204))
  .catch(err => next(err));
};