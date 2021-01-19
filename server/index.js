const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();

app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.static('./public'));

app.get('/', (req, res) => {
    res.json({
        message: "whaddip"
    });
});

app.get('/', (req, res) => {
    //TODO: short URL
});

const port = process.env.PORT || 6969;

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
})