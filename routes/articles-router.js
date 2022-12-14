const articlesRouter = require('express').Router();
const {getArticles, getArticleById, getCommentsByArticle, postComment, patchArticleVotes, postArticle} = require('../controllers/news.controllers');

articlesRouter
.route('/')
.get(getArticles)
.post(postArticle);

articlesRouter
.route('/:article_id')
.get(getArticleById)
.patch(patchArticleVotes);

articlesRouter
.route('/:article_id/comments')
.get(getCommentsByArticle)
.post(postComment);

module.exports = articlesRouter;