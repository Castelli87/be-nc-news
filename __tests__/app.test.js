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

describe("/api/topics", () => {
  test("GET - status: 200 - respond with all the properties", () => {
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
  test("status:404, responds with an error message ", () => {
    return request(app)
      .get("/api/notAroute")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not Found");
      });
  });
});

describe("/api", () => {
  test("GET /api should return JSON with available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body.result).toEqual(endpoints);
      });
  });
});

describe("api/articles/:article_id", () => {
  test("GET - status: 200 - respond with an article object", () => {
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
});

describe("GET - /api/articles/invalidArticleId", () => {
  test("400 - responds with error message when invalid path given", () => {
    return request(app)
      .get("/api/articles/nosense")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("bad request");
      });
  });
  test("404 - responds with error message when id not found", () => {
    return request(app)
      .get("/api/articles/1000000000")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("not found");

      });
  });
});

describe.only("/api/articles", () => {
  test("GET - status: 200 - get all the articles but body", () => {
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
  test("GET - status: 200 - get all the articles but not the body, all sorted by the column created_at in a descending order and group by article_id ", () => {
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

describe("api/articles/:article_id/comments", () => {
  test("GET - status: 200 - respond with an article object", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.commentsByArticleId.length === 11);
        response.body.commentsByArticleId.forEach((comment) => {
          expect(typeof comment).toBe("object");
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("article_id");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("votes");
        });
      });
  });
  test("400 - responds with error message when invalid path given", () => {
    return request(app)
      .get("/api/articles/nosense/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("bad request");
      });
  });
  test("404 - responds with error message when id not found", () => {
    return request(app)
      .get("/api/articles/1000000000/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("not found");

      });
  });
});
