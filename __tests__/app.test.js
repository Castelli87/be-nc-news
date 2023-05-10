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
/*     test('GET - status: 200 - respond with all the endpoints',()=>{
      return request(app)
      .get('/api')
      .expect(200)
      .then((response)=>{
        expect(response.body.msg).toEqual()
      })
    }) */
})

describe('/api', () => {
  test('GET /api should return JSON with available endpoints', () => {
      return request(app)
      .get('/api')
      .expect(200)
      .then((response) => {
      
        expect(response.body.result).toEqual(endpoints);
        expect(typeof response.body.result).toBe('object');
        expect(response.body.result).toHaveProperty('GET /api');
        expect(response.body.result).toHaveProperty('GET /api/topics');
        expect(response.body.result).toHaveProperty('GET /api/articles');
      });
    });      
});
