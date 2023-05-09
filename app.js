const express = require('express')

const app = express()

app.use(express.json())

const {getTopics}=require('./controllers/topics.controller')

app.get('/api/topics',getTopics)


app.use((err, req, res, next) => {
    console.log(err);
    res.status(404).send({ msg: 'Not Found' });
  });

app.all('*', (req, res) => {
    res.status(404).send({ msg: 'Not Found' })
})

module.exports = app;