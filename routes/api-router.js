const apiRouter = require('express').Router();
const topicsRouter = require('./topics-router');
const articlesRouter = require('./articles-router');
const usersRouter = require('./users-router');
const commentsRouter = require('./comments-router');

apiRouter.use('/api/topics', topicsRouter);
apiRouter.use('/api/articles', articlesRouter);
apiRouter.use('/api/users', usersRouter);
apiRouter.use('/api/comments', commentsRouter);

module.exports = apiRouter;