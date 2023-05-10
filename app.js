const express = require("express");

const app = express();

app.use(express.json());

const { getTopics, getApi } = require("./controllers/topics.controller");




app.get("/api/topics", getTopics);

app.get("/api", getApi);





app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

module.exports = app;
