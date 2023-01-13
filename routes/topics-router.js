const topicsRouter = require('express').Router();
const {getTopics, postTopic, deleteTopic} = require('../controllers/news.controllers');

topicsRouter
.route('/')
.get(getTopics)
.post(postTopic);

topicsRouter
.route('/:topic')
.delete(deleteTopic);

module.exports = topicsRouter;