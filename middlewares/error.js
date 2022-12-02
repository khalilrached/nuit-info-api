module.exports = (err,req,res,next) => {
    return res.status(500).json({
        "status":"error",
        "message":err.message,
        "stacks":(process.env.NODE_ENV == 'production')?null:err.stacks
    })
}