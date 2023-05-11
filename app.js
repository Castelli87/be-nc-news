const express = require("express");

const app = express();



const { getTopics, getApi} = require("./controllers/topics.controller");

const {getArticleById,getArticles}=require('./controllers/article.controller')



app.get("/api/topics", getTopics);

app.get("/api", getApi);

app.get("/api/articles/:article_id",getArticleById);


app.get("/api/articles",getArticles)







app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});


app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request" });
  } else if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else res.status(500).send({ msg: "Internal Server Error" });
});


module.exports = app;
