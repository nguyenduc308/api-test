const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParse = require('body-parser');
const PORT = process.env.PORT || 8000;
mongoose.connect('mongodb+srv://admin:9jSUXf0aZ9udKddT@ducluxblog.c36zo.mongodb.net/blog?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => console.log("db connnect"))
    .catch(console.log)


app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    next();
});
app.use(bodyParse.urlencoded({ extended: true }));
app.use(bodyParse.json());

app.use('/api/v1', require('./api'));

app.listen(PORT, () => {
    console.log('Blog running on port' + PORT)
})
