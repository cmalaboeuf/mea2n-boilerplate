var express = require('express');
var router = express.Router();
var posts = require('./posts');

/**
 * API Posts
 */
router.get('/posts',posts.getAll);
router.get('/posts/:id',posts.getById);
router.post('/posts', posts.newPost);
router.put('/posts/:id', posts.editPost);
router.delete('/posts/:id',posts.deletePost);

module.exports = router;