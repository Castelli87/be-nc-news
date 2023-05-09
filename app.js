const express = require('express')

const app = express()

app.use(express.json())

const {getTopics}=require('./controllers/topics.controller')

app.get('/api/topics',getTopics)



app.all('*', (req, res) => {
    res.status(404).send({ msg: 'Not Found' })
})

module.exports = app;