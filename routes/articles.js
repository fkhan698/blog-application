const express = require('express');
const router = express.Router();
const Article = require('../models/article')


router.get('/new', (req,res) => {
 
    res.render('articles/new', {article: new Article()})
})

router.get('/:slug', async (req,res) => {
    const article = await Article.findOne({slug: req.params.slug});
    if(article === null) res.redirect('/')
    res.render('articles/show', {article: article});

})
router.get('/edit/:slug', async(req, res) => {
    const article = await Article.findOne({slug: req.params.slug});
    res.render('articles/edit', {article: article})
})
router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
}, saveArticleandRedirect('edit'))

router.post('/', async (req, res, next) => {
    req.article = new Article()
    next()
}, saveArticleandRedirect('new'))

router.delete('/:slug', async(req, res) => {
    await Article.findByIdAndDelete(req.params.slug)
    res.redirect('/')
})

router.put('/:id', async(req, res, next) => {
   req.article = await Article.findById(req.params.id)
   next()
}, saveArticleandRedirect('edit'))

function saveArticleandRedirect(path){
    return async(req, res) => {
        let article = req.article
        article.title = req.body.title
        article.description = req.body.description
        article.markdown = req.body.markdown
        try {
            article = await article.save();
            res.redirect(`/articles/${article.slug}`)
        } catch(e){
            console.log(e)
            res.render(`/articles/${path}`,{article: article })
        }
    }
}



module.exports = router;