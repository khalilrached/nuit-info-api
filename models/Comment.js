const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const CommentSchema = new Schema({
    id: String,
    content: String,
    likes: Number,
    dislikes: Number,
    date: Number,
});

CommentSchema.methods.like = function(){
    this.likes += 1;
}
CommentSchema.methods.dislike = function(){
    this.dislikes += 1;
}

const Feedback = mongoose.model('Comment',CommentSchema);

module.exports = Feedback;