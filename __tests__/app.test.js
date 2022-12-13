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
  expect(msg).toBe('Path not found.');
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

describe("4) GET /api/articles/:article_id", () => {
  it("Responds with 200 status code and an article object with an article_id matching the value specified in the path.", () => {
  return request(app)
  .get('/api/articles/8')
  .expect(200)
  .then(({body:{article}}) => {
    expect(article).toEqual(expect.objectContaining({
      author: "icellusedkars",
      title: "Does Mitch predate civilisation?",
      article_id: 8,
      body: "Archaeologists have uncovered a gigantic statue from the dawn of humanity, and it has an uncanny resemblance to Mitch. Surely I am not the only person who can see this?!",
      topic: "mitch",
      created_at: expect.any(String),
      votes: 0
    }));
  })
  })
  
  it("Returns 404 status code if client makes a request on a path that contains an article_id which does not exist in the database.", () => {
    return request(app)
    .get('/api/articles/20')
    .expect(404)
    .then(({body : {msg}}) => {
      expect(msg).toBe("Article not found.");
    })
  })
  
  it("Returns 400 status code if client makes a request on a path that contains an article_id which uses an invalid data type.", () => {
    return request(app)
    .get('/api/articles/2l')
    .expect(400)
    .then(({body : {msg}}) => {
      expect(msg).toBe("Bad request.");
    })
  })
  })