if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config({ path: '.env' });
}
const express = require('express');
const app = express();
const path = require('path');
const Article = require('./models/article')
const mongoose = require('mongoose');
const methodOverride = require('method-override');
// const expressLayouts = require('express-ejs-layouts');

const articleRouter = require('./routes/articles');
const loginRouter = require('./routes/passport/login')
const registerRouter = require('./routes/passport/register')
const logoutRouter = require('./routes/passport/logout')

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})
const db = mongoose.connection;
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false}));
app.use('/public', express.static(path.join(__dirname, "public")));
// app.use(expressLayouts)
app.use(methodOverride('_method'));


app.get('/', async(req, res) => {
   const articles = await Article.find().sort({createdAt: 'desc'});
   res.render('articles/index', {articles:articles})
})


app.use('/articles', articleRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/logout', logoutRouter);
app.listen(process.env.PORT || 3000)