const logger = require('../log')(__filename);
const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://khalil:QXuXRiUFWr5YsYEw@cluster0.6eeggzx.mongodb.net/?retryWrites=true&w=majority",{useNewUrlParser: true, useUnifiedTopology: true},()=>{
    logger.info('db connected');
});
