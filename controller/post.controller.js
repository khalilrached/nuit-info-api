const logger = require('../log')(__filename);
const Joi = require('joi');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const uuidv4 = require('uuid').v4
module.exports = {
    getPost:async (req,res,next)=>{
        const $id = Joi.string().uuid().required();
        if(!Object.keys(req.params).includes('id')){
            const err = new Error()
            err.message = 'no id was given!'
            err.code = 400;
            return next(err);
        }
        if($id.validate(req.params.id).error){
            const err = new Error();
            err.message = $id.validate(req.params.id).error.message;
            err.code = 400;
            return next(err)
        }
        try{
            const post = await Post.findOne().where('id').equals(req.params.id);
            if(!post){
                const err = new Error();
                err.message = `there's no post with this id: ${req.params.id} !`
                err.code = 404
                return next(err);
            }
            return res.status(200).json({
                post:post,
            }) 
        }catch(err){
            logger.error('%o',err);
            const $err = new Error();
            $err.message = 'something went wrong!'
            $err.code = 500;
            return next($err)
        }
        },
    searchPosts:async (req,res,next)=>{
        try{
            const { search,limit } = req.params;
            const posts = await Post.find({}).where('content').regex('.*' + search + '.*').sort({date:'desc'}).limit(limit);
            return res.json({
                posts
            })
        }catch(err){
            logger.error('%o',err);
            const $err = new Error();
            $err.message = 'something went wrong!'
            $err.message = 500
            return next(err);
        }
    },
    getPosts:async (req,res,next)=>{
        try{
            const { offset,limit } = req.params;
            const posts = await Post.find({}).sort({date:'desc'}).skip(offset).limit(limit);
            return res.status(200).json({
                posts
            })
        }catch(err){
            logger.error('%o',err);

            const $err = new Error();
            $err.message = 'something went wrong!'
            $err.message = 500
            return next(err);
        }
    },
    createPost:async (req,res,next)=>{
        const $post_schema = Joi.object({
            content:Joi.string().min(20).max(500).required(),
        })
        if($post_schema.validate(req.body).error){
            const err = new Error();
            err.message = 'invalid body request'
            err.code = 400;
            return next(err);
        }
        const {content} = $post_schema.validate(req.body).value
        try{
            const post = await Post.create({
                id:uuidv4(),
                likes:0,
                dislikes:0,
                date:Date.now(),
                commentId:[],
                content
            })
            return res.status(201).json({
                newPost:post
            })
        }catch(err){
            logger.error('%o',err);
            const $err = new Error('');
            $err.message = 'something went wrong';
            $err.code = 500
            return next($err);
        }
    },
    createComment:async (req,res,next) => {
        if(!Object.keys(req.params).includes('id')){
            const err = new Error();
            err.message = 'invalid id';
            err.code = 400;
            return next(err) 
        }
        const {id} = req.params;
        const $body_schema = Joi.object({
            content:Joi.string().min(20).max(200).required()
        })
        if($body_schema.validate(req.body).error){
            logger.error('%o',err);
            const err = new Error();
            err.message = 'invalid request';
            err.code = 400;
            return next(err);
        }
        const {content} = $body_schema.validate(req.body).value;
        try{
            const post = await Post.findOne().where('id').equals(id);
            if(!post){
                const err = new Error();
                err.message = 'post not found';
                err.code = 404;
                return next(err);
            }else{
                const comment = await Comment.create({
                    id:uuidv4(),
                    content,
                    likes: 0,
                    dislikes: 0,
                    date: Date.now()
                });
                post.comments.push(comment);
                await post.save();
                return res.status(201).json({
                    comment
                })
            }
        }catch(err){
            logger.error('%o',err);
            const $err = new Error();
            $err.message = 'something went wrong';
            $err.code = 500;
            return next($err);
        }
    },
    updatePost:async (req,res,next)=>{
        if(!Object.keys(req.params).includes('id')){
            const err = new Error();
            err.message = 'there\'s no id';
            err.code = 400;
            return next(err);
        }
        const {id} = req.params;
        const $body_schema = Joi.object({
            isLike:Joi.boolean().optional(),
            isDislike:Joi.boolean().optional(),
        })
        .or('isLike','isDislike')
        .required();
        if($body_schema.validate(req.body).error){
            const err = new Error();
            err.message = 'invalid request';
            err.code = 400;
            return next(err);
        }
        const body = $body_schema.validate(req.body).value;
        try{
            const post = await Post.findOne().where('id').equals(id);
            if(Object.keys(body).includes('isLike')){
                post.like();
            }
            if(Object.keys(body).includes('isDislike')){
                post.dislike();
            }
            const newPost = await post.save()
            return res.status(201).json({
                "post":newPost
            })
        }catch(err){
            logger.error('%o',err);
            const $err = new Error();
            $err.message = 'something went wrong!';
            $err.code = 500;
            return next($err);
        }
    },
    updatePostComment:async (req,res,next)=>{
        if(!Object.keys(req.params).includes('id')){
            const err = new Error();
            err.message = 'there\'s no id';
            err.code = 400;
            return next(err);
        }
        const {id} = req.params;
        const $body_schema = Joi.object({
            isLike:Joi.boolean().optional(),
            isDislike:Joi.boolean().optional(),
        })
        .or('isLike','isDislike')
        .required();
        if($body_schema.validate(req.body).error){
            const err = new Error();
            err.message = 'invalid request';
            err.code = 400;
            return next(err);
        }
        const body = $body_schema.validate(req.body).value;
        try{
            const comment = await Comment.findOne().where('id').equals(id);
            if(Object.keys(body).includes('isLike')){
                comment.like();
            }
            if(Object.keys(body).includes('isDislike')){
                comment.dislike();
            }
            const newComment = await comment.save()
            return res.status(201).json({
                "post":newComment
            })
        }catch(err){
            logger.error('%o',err);
            const $err = new Error();
            $err.message = 'something went wrong!';
            $err.code = 500;
            return next($err);
        }
    }
}