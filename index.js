const express = require('express');
const morgan = require('morgan');
const yup = require('yup');
const { nanoid } = require('nanoid');
const monk = require('monk');

const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');

require('dotenv').config();

const db = monk(process.env.MONGODB_URI);
const urls = db.get('urls');

urls.createIndex({slug: 1 }, { unique: true });

const app = express();

app.use(morgan('tiny'));
app.use(express.json());
app.use(express.static('./public'));


app.get('/:id', async (req, res, next) => {
    const { id: slug } = req.params;
    try{
        const url = await urls.findOne({ slug });
        if(url){
            res.redirect(url.url);
        }
        res.redirect(`/?error=${slug} not found`);
    }catch(error){
        res.redirect(`/?error=Link not found`);
        console.error(error);
    }
})

const schema = yup.object().shape({
    slug: yup.string().trim().matches(/[\w\-]/i),
    url: yup.string().trim().url().required()
});

app.use((error, req, res, next) => {
    if(error.status){
        res.status(error.status);
    }else{
        res.status(500);
    }
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? 'stack': error.stack
    })
})

app.post('/noob', async (req, res, next) => {
    let {slug, url } = req.body;
    console.log(req.body);
    try{
        await schema.validate({
            slug,
            url,
        })
        if(!slug){
            slug = nanoid(5);
        }
        else{
            const existing = await urls.findOne({ slug });
            if(existing){
                throw new Error('Slug in user.')
            }
        }
        slug = slug.toLowerCase();
        const newURL = {
            url,
            slug,
        };
        const created = await urls.insert(newURL);
        res.json(created);

    }catch(error){
        next(error);
    }
});

app.get('/test', function (req, res) {
    res.send('hello world')
  })

const port = process.env.PORT || 7000;

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
})