const request = require("supertest");
const seed = require("../db/seeds/seed");
const app = require("../app");
const db = require("../db/connection");
const endpoints = require("../endpoints.json");

const {
  topicData,
  userData,
  articleData,
  commentData,
} = require("../db/data/test-data/index");

beforeEach(() => {
  return seed({ topicData, userData, articleData, commentData });
});

afterAll(() => {
  db.end();
});

describe("/api", () => {
  test("GET - STATUS: 200 - respond with a  endpoints list  available", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body.result).toEqual(endpoints);
      });
  });
});

describe("/api/topics", () => {
  test("GET - STATUS: 200 - respond with all the properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topics.length).toBe(3);
        response.body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
  test("GET - STATUS: 404 - responds with an error message ", () => {
    return request(app)
      .get("/api/notAroute")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not Found");
      });
  });
});


describe("api/articles/:article_id", () => {
  test("GET - STATUS: 200 - respond with an article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        expect(article.article_id).toBe(1);
        expect(article.title).toBe("Living in the shadow of a great man");
        expect(article.topic).toBe("mitch");
        expect(article.author).toBe("butter_bridge");
        expect(article.body).toBe("I find this existence challenging");
        expect(typeof article.created_at).toBe("string");
        expect(article.votes).toBe(100);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("GET - STATUS: 400 - responds with error message when invalid path given", () => {
    return request(app)
      .get("/api/articles/nosense")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("bad request");
      });
  });
  test("GET - STATUS: 404 - responds with error message when id not found", () => {
    return request(app)
      .get("/api/articles/1000000000")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("not found");
      });
  });
});

describe("api/articles/:article_id/comments", () => {
  test("GET - STATUS: 200 - respond with an article object sorted by the column created_at", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.commentsByArticleId.length).toBe(11);
        expect(response.body.commentsByArticleId).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("GET - STATUS: 200 - respond with an article object", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.commentsByArticleId.length === 11);
        response.body.commentsByArticleId.forEach((comment) => {
          expect(typeof comment).toBe("object");
          expect(comment.article_id).toBe(1);
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("article_id");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("votes");
        });
      });
  });
  test("GET - STATUS: 400 - responds with error message when invalid path given", () => {
    return request(app)
      .get("/api/articles/nosense/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("bad request");
      });
  });
  test("GET - STATUS: 404 - responds with error message when id not found", () => {
    return request(app)
      .get("/api/articles/1000000000/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("not found");
      });
  });
  test("GET - STATUS: 200 - responds with an empty array ", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.commentsByArticleId).toEqual([]);
      });
  });

});
describe("/api/articles", () => {
  test("GET - STATUS: 200 - get all the articles but without  body", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        expect(res.body.articles.length).toBe(5);
        res.body.articles.forEach((article) => {
          expect(typeof article).toBe("object");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("author");
          expect(article).not.toHaveProperty("body");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
        });
      });
  });
  test("GET - STATUS: 200 - get all the articles but not the body, all sorted by the column created_at in a descending order and group by article_id ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        expect(res.body.articles[0].comment_count).toBe(2);
        expect(res.body.articles).toBeSorted("created_at", {
          descending: true,
        });
      });
  });
});

/// ADD one test with a 404 code because was a bad request /api/nosense 

describe("/api/articles/:article_id/comments", () => {
  test("POST - STATUS : 201 - respond with a new comment ", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .expect(201)
      .send({
        username: "butter_bridge", 
        body: "I'm making a comment ",
      })
      .then((response) => {
        const { comment } = response.body;
        expect(comment.author).toBe("butter_bridge");
        expect(comment.body).toBe("I'm making a comment ");
      });
  });
  test("POST - STATUS : 201 - respond with a new comment ignoring properties that are not username and body", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .expect(201)
      .send({
        username: "butter_bridge",
        body: "I'm making a comment ",
        votes: 100,
      })
      .then((response) => {
        const { comment } = response.body;
        expect(comment.author).toBe("butter_bridge");
        expect(comment.body).toBe("I'm making a comment ");
      });
  });
  test("POST - STATUS : 400 - responds with error message when invalid path given", () => {
    return request(app)
      .post("/api/articles/nosense/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("bad request");
      });
  });
  test("POST - STATUS : 404 - responds with error message when id not found", () => {
    return request(app)
      .post("/api/articles/1000000000/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("not found");
      });
  });
  test("POST - STATUS : 400 - respond with an error when one of the two properties are missing ", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .expect(400)
      .send({
        username: "butter_bridge",
      })
      .then((response) => {
        expect(response.body.msg).toBe("Missing value");
      });
  });
  test("POST - STATUS : 400 - respond with an error when the username is not correct ", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .expect(400)
      .send({
        username: "Davide",
        body: "I'm making a comment ",
      })
      .then((response) => {

        expect(response.body.msg).toBe("username not valid");
      });
  });
});
