const apiRouter = require('express').Router();
const topicsRouter = require('./topics-router');
const usersRouter = require('./users-router');

const articlesRouter = require('./articles-router');

apiRouter.use('/api/topics', topicsRouter);
apiRouter.use('/api/articles', articlesRouter);
apiRouter.use('/api/users', usersRouter);

module.exports = apiRouter;