const router = require('express').Router();
const controller = require('../controller/post.controller');

router.get('/id/:id',controller.getPost);
router.get('/search/:search/:limit',controller.searchPosts);
router.get('/:offset/:limit',controller.getPosts);
router.put('/comment/:id',controller.createComment);
router.put('/',controller.createPost);
router.post('/id/:id',controller.updatePost);
router.post('/comment/id/:id',controller.updatePostComment);

module.exports = router;