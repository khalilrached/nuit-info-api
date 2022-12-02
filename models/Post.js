const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;
const Comment = require('./Comment'); 
const PostSchema = new Schema({
    id: String,
    sessionid: String,
    content: String,
    likes: Number,
    dislikes: Number,
    comments:[],
    date: Number,
});

PostSchema.methods.like = function(){
    this.likes += 1;
}
PostSchema.methods.dislike = function(){
    this.dislikes += 1;
}
PostSchema.methods.addComment = async function(commentid){
    this.commentId.push(commentid);
}


const Feedback = mongoose.model('Post',PostSchema);

module.exports = Feedback;