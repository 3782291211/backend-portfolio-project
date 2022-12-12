const request = require('supertest');
const db = require('../db/connection');
const app = require('../app');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');

afterAll(() => {
  if (db.end) db.end();
});
  
beforeEach(() => seed(data));

describe("1) 404 : Invalid path", () => {
it("Responds with 404 status code if client makes a request to an invalid path.", () => {
return request(app)
.get('/api/topisc')
.expect(404)
.then(({ body : { msg }}) => {
  expect(msg).toBe('Invalid path');
})
})
})

describe("2) GET api/topics", () => {
it("Responds with 200 status code and an array of topic objects each with two keys: slug and description.", () => {
return request(app)
.get('/api/topics')
.expect(200)
.then(({ body : { topics } }) => {
expect(topics).toBeInstanceOf(Array);
expect(topics).toHaveLength(3);

topics.forEach(topic => {
    expect(topic).toEqual(
      expect.objectContaining({
          description: expect.any(String),
          slug: expect.any(String)
      }))
    })
});
})
})

describe("3) GET /api/articles", () => {
it("Responds with 200 status code and an array of article objects sorted by descending date order, each object having a comment_count property with the correct number of comments for that article.", () => {
return request(app)
.get('/api/articles')
.expect(200)
.then(({body : {articles}}) => {
  expect(articles).toHaveLength(12);
  expect(articles).toBeSortedBy('created_at', { descending: true });
  articles.forEach(article => {
    if(article.article_id === 1) {
        expect(article.comment_count).toBe(11);
    } else if (article.article_id === 5) {
        expect(article.comment_count).toBe(2);
    }
    expect(article).toEqual(
      expect.objectContaining({
        author: expect.any(String),
        title: expect.any(String),
        article_id: expect.any(Number),
        topic:expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        comment_count: expect.any(Number)
      })
    )
  });
})
})
})

