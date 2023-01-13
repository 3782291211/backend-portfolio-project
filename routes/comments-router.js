const commentsRouter = require('express').Router();
const {deleteComment, patchCommentVotes, getComments} = require('../controllers/news.controllers');

commentsRouter
.route('/:comment_id')
.patch(patchCommentVotes)
.delete(deleteComment);

commentsRouter
.route('/')
.get(getComments);

module.exports = commentsRouter;