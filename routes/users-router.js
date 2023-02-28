const usersRouter = require('express').Router();
const {getUsers, getUserById, patchUser} = require('../controllers/news.controllers');

usersRouter
.route('/')
.get(getUsers);

usersRouter
.route('/:username')
.get(getUserById)
.patch(patchUser);

module.exports = usersRouter;