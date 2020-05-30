if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config({ path: '.env' });
}
const express = require('express');
const app = express();
const path = require('path');
const flash = require('express-flash');
const session = require('express-session')
const Article = require('./models/article')
const passport = require('passport')
const mongoose = require('mongoose');
const methodOverride = require('method-override');
// const expressLayouts = require('express-ejs-layouts');

const articleRouter = require('./routes/articles');
const loginRouter = require('./routes/login')
const registerRouter = require('./routes/register')
const logoutRouter = require('./routes/logout')

//Database connection
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})
const db = mongoose.connection;
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

//EJS Files
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false}));
app.use('/public', express.static(path.join(__dirname, "public")));

//Session and Flash 
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
//Passport Dependencies
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'));




app.get('/', checkAuthenticated, async(req, res) => {
   const articles = await Article.find().sort({createdAt: 'desc'});
   res.render('articles/index', {articles:articles})
})

function checkAuthenticated(req, res, next){
  if(req.isAuthenticated()){
      return next()
  }
  res.redirect('login')
}


app.use('/articles', articleRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/logout', logoutRouter);

app.listen(process.env.PORT || 3000)