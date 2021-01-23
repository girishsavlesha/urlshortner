const express = require('express');
const morgan = require('morgan');
const yup = require('yup');
const { nanoid } = require('nanoid');
const monk = require('monk');
var jwt = require('jsonwebtoken');

const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');

require('dotenv').config();

const db = monk(process.env.MONGODB_URI);
db.then(() => {
     console.log('Connected correctly to server')
})
const urls = db.get('urls');

urls.createIndex({slug: 1 }, { unique: true });

const app = express();

app.enable('trust proxy');
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.static('./public'));

const verifyToken = function(req, res, next){
    let authBearer = req.headers['authorization'];
    if(authBearer){
        const bearer = authBearer.split(' ');
        const bearerToken = bearer[1];
        jwt.verify(bearerToken, process.env.JWT_KEY, function(err, decoded) {

            if(err){
                console.log(err);
                throw new Error('not authorized')
            }
          });
          next();
    }
}

app.post('/',(req, res) => {

    var { token } = req.body;
    if(token == undefined){
        var  token = jwt.sign({ name: 'mustard' }, process.env.JWT_key);
    }
    res.json({
        token: token
    })
})

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


app.post('/noob',slowDown({
    windowMs: 10 * 1000,
    delayAfter: 1,
    delayMs: 500,
  }), rateLimit({
    windowMs: 10 * 1000,
    max: 1,
  }),verifyToken, async (req, res, next) => {
    let {slug, url } = req.body;
    console.log(req.body);
    try{
        await schema.validate({
            slug,
            url,
        });


        if (url.includes('themustardcat.herokuapp.com')) {
            throw new Error(`you can't short same url`);
          }
        if(!slug){
            slug = nanoid(5);
        }
        else{
            const existing = await urls.findOne({ slug });
            if(existing){
                throw new Error('Slug in use');
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


const port = process.env.PORT || 7000;

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
})


