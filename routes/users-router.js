const usersRouter = require('express').Router();
const {getUsers, getUserById, patchUser, deleteAccount} = require('../controllers/news.controllers');

usersRouter
.route('/')
.get(getUsers);

usersRouter
.route('/:username')
.get(getUserById)
.patch(patchUser)
.delete(deleteAccount);

module.exports = usersRouter;