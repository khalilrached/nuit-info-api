const express           = require('express');
const cors              = require('cors');
const helmet            = require('helmet');
const logger            = require('./log')(__filename);
const postRoute     = require('./routes/post.route');
const errorHandler      = require('./middlewares/error');
const notFoundHandler   = require('./middlewares/notFound')
require('./config/db');
require('dotenv').config();

const PORT = process.env.PORT;

const app = express();
app.use(cors({origin:'*'}));
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/post',postRoute)

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT,()=>{
    logger.info(`server started`);
});