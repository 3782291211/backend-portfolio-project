const apiRouter = require('express').Router();
const topicsRouter = require('./topics-router');
const articlesRouter = require('./articles-router');
const usersRouter = require('./users-router');
const commentsRouter = require('./comments-router');
const {getJSONendpoints, showWelcomeMessage, login, signup} = require('../controllers/news.controllers');

apiRouter.use('/api/topics', topicsRouter);
apiRouter.use('/api/articles', articlesRouter);
apiRouter.use('/api/users', usersRouter);
apiRouter.use('/api/comments', commentsRouter);

apiRouter
.route('')
.get(showWelcomeMessage);

apiRouter
.route('/api')
.get(getJSONendpoints);

apiRouter
.route('/api/login')
.post(login);

apiRouter
.route('/api/signup')
.post(signup);

module.exports = apiRouter;