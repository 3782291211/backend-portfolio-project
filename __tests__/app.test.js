const request = require('supertest');
const db = require('../db/connection');
const app = require('../app');
const seed = require('../db/seeds/seed');
const { articleData, commentData, topicData, userData} = require('../db/data/test-data/index');

afterAll(() => {
  if (db.end) db.end();
});
  
beforeEach(() => seed({articleData, commentData, topicData, userData}));

describe("1) 404 : invalid path", () => {
it("Responds with 404 if client makes a request to an invalid path", () => {
return request(app)
.get('/api/topisc')
.expect(404)
.then(({ body : { message }}) => {
  expect(message).toBe('Invalid path');
})
})
})

describe("2) GET api/topics", () => {
it("Responds with 200 status and an array of topic objects each with two keys: slug and description", () => {
return request(app)
.get('/api/topics')
.expect(200)
.then(({ body : { topics } }) => {
expect(topics).toBeInstanceOf(Array);
expect(topics).toHaveLength(3);
expect(topics).toEqual([
    {
      description: 'The man, the Mitch, the legend',
      slug: 'mitch'
    },
    {
      description: 'Not dogs',
      slug: 'cats'
    },
    {
      description: 'what books are made of',
      slug: 'paper'
    }
  ]);
})
})
})


