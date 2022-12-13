const articlesRouter = require('express').Router();
const {getArticles, getArticleById, getCommentsByArticle} = require('../controllers/news-controllers');

articlesRouter
.route('/')
.get(getArticles);

articlesRouter
.route('/:article_id')
.get(getArticleById);

articlesRouter
.route('/:article_id/comments')
.get(getCommentsByArticle)

module.exports = articlesRouter;