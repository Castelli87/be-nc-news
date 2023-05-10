const request = require("supertest");
const seed = require("../db/seeds/seed");
const app = require("../app");
const db = require("../db/connection");
const endpoints = require('../endpoints.json');

const { topicData, userData, articleData, commentData }= require ('../db/data/test-data/index')

beforeEach(() => {
    return seed({ topicData, userData, articleData, commentData });
  });

  afterAll(() => {
    db.end();
  });

  describe('/api/topics', () => {
    test("GET - status: 200 - respond with all the properties", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          expect(response.body.topics.length).toBe(3);
          response.body.topics.forEach((topic) => {
            expect(typeof topic.slug).toBe("string");
            expect(typeof topic.description).toBe("string");
          })
        });

    });
    test('status:404, responds with an error message ', () => {
      return request(app)
        .get('/api/notAroute')
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe('Not Found');
        });
    });
})

describe('/api', () => {
  test('GET /api should return JSON with available endpoints', () => {
      return request(app)
      .get('/api')
      .expect(200)
      .then((response) => {
        expect(response.body.result).toEqual(endpoints);
      });
    });      
});

describe('api/articles/:article_id', () => {
  test('GET - status: 200 - respond with an article object', () => {
    return request(app)
    .get('/api/articles/1')
    .expect(200)
    .then((response)=>{

      const article = response.body.article;
      expect(article.article_id).toBe(1);
      expect(article.title).toBe('Living in the shadow of a great man');
      expect(article.topic).toBe('mitch');
      expect(article.author).toBe('butter_bridge');
      expect(article.body).toBe('I find this existence challenging');
      expect(typeof article.created_at).toBe('string');
      expect(article.votes).toBe(100);
      expect(article.article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700')
    })
  });

});


describe("GET - /api/articles/invalidArticleId", () => {
  test("400 - responds with error message when invalid path given", () => {
    return request(app)
      .get("/api/articles/nosense")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('bad request');
      });
  });
  test("404 - responds with error message when id not found", () => {
    return request(app)
      .get("/api/articles/1000000000")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('not found');
      });
    });
  });
