const articlesRouter = require('express').Router();
const {getArticles, getArticleById, getCommentsByArticle, postComment, patchArticleVotes, postArticle, deleteArticle} = require('../controllers/news.controllers');

articlesRouter
.route('/')
.get(getArticles)
.post(postArticle);

articlesRouter
.route('/:article_id')
.get(getArticleById)
.patch(patchArticleVotes)
.delete(deleteArticle);

articlesRouter
.route('/:article_id/comments')
.get(getCommentsByArticle)
.post(postComment);

module.exports = articlesRouter;