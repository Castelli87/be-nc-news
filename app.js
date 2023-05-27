const express = require("express");

const app = express();

app.use(express.json());

const { getTopics, getApi } = require("./controllers/topics.controller");

const {
  getArticleById,
  getArticles,
  selectVotesById
} = require("./controllers/article.controller");

const {
  getCommentsByArticleId,
  addComment,
} = require("./controllers/comments.controller");

app.get("/api/topics", getTopics);

app.get("/api", getApi);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.get("/api/articles", getArticles);

app.post("/api/articles/:article_id/comments", addComment);

app.patch("/api/articles/:article_id",selectVotesById)

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use((err, req, res, next) => {
 
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Missing value" });
  } else if (err.code === "23503") {
    res.status(400).send({ msg: "username not valid" });
  } else if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
