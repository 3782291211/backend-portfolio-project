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
  expect(msg).toBe("Invalid data type in URL.");
  })
})
})

describe("5) GET /api/articles/:article_id/comments", () => {
it("Responds with 200 status code and an array of comments for the given article_id.", () => {
return request(app)
.get('/api/articles/5/comments')
.expect(200)
.then(({body:{comments}}) => {
  expect(comments).toHaveLength(2);
  comments.forEach(comment => {
    expect(comment).toEqual(
      expect.objectContaining({
        comment_id: expect.any(Number),
        votes: expect.any(Number),
        created_at: expect.any(String),
        author: expect.any(String),
        body: expect.any(String)
      })
    )
  });
})
})

it("Responds with 200 status code and an array of comments for the given article_id, sorted by most recent.", () => {
  return request(app)
  .get('/api/articles/1/comments')
  .expect(200)
  .then(({body:{comments}}) => {
    expect(comments).toBeSortedBy('created_at', {descending : true});
    expect(comments).toHaveLength(11);
  })
})

it("Returns 404 status code if client makes a request on a path that contains an article_id which does not exist in the database.", () => {
  return request(app)
  .get('/api/articles/44/comments')
  .expect(404)
  .then(({body : {msg}}) => {
     expect(msg).toBe("Article not found.");
  })
})

it("Returns 200 status code and an empty array if client makes a request on a path that contains a valid article_id for which there are no comments in the database.", () => {
  return request(app)
  .get('/api/articles/4/comments')
  .expect(200)
  .then(({body : {comments}}) => {
    expect(comments).toEqual([]);
  })
})

it("Returns 400 status code if client makes a request on a path that contains an article_id which uses an invalid data type.", () => {
  return request(app)
  .get('/api/articles/1l/comments')
  .expect(400)
  .then(({body : {msg}}) => {
    expect(msg).toBe("Invalid data type in URL.");
  })
})

})

describe("6) POST /api/articles/:article_id/comments", () => {
it("Responds with 201 status code, adds new comment to database and sends the newly posted comment in the response.", () => {
  return request(app)
  .post('/api/articles/4/comments')
  .send({username : "lurker", body: "To listen requires a voice, for what needs to be known requires us to ask."})
  .expect(201)
  .then(({body : {new_comment}}) => {
     expect(new_comment).toEqual(
      expect.objectContaining({
          comment_id: 19,
          body: "To listen requires a voice, for what needs to be known requires us to ask.",
          article_id: 4,
          author : "lurker",
          votes: 0,
          created_at: expect.any(String)
      }));
    });
})
  
it("Returns 400 status code if request body is missing a required key.", () => {
  return request(app)
  .post('/api/articles/8/comments')
  .send({body: "To listen requires a voice, for what needs to be known requires us to ask."})
  .expect(400)
  .then(({ body : { msg }}) => {
    expect(msg).toBe("Bad request.");
  });
})
  
it("Returns 400 status code if username specified in request body does not reference an existing username in the users table (foreign key constraint violation).", () => {
  return request(app)
  .post('/api/articles/2/comments')
  .send({username: "Racetrack", body: "Where did he go?"})
  .expect(404)
  .then(({ body : { msg }}) => {
    expect(msg).toBe("Username not found.");
  });
})
  
it("Returns 400 status code if object in request body contains a misspelled key (not-null constraint violation).", () => {
return request(app)
  .post('/api/articles/11/comments')
  .send({userneme: "icellusedkars", body: 'hello'})
  .expect(400)
  .then(({ body : { msg }}) => {
    expect(msg).toBe("Bad request.");
  });
})
  
it("Returns 400 if article_id parameter does not reference an existing article in the database (foreign key constraint violation).", () => {
  return request(app)
  .post('/api/articles/22/comments')
  .send({username : "lurker", body: "Engulfed by a sea of neon lights."})
  .expect(404)
  .then(({body : {msg}}) => {
    expect(msg).toBe("Article not found.");
  });
})

it("Returns 400 status code if response URL includes an invalid article_id.", () => {
  return request(app)
  .post('/api/articles/id9/comments')
  .send({username : "lurker", body: "Engulfed by a sea of neon lights."})
  .expect(400)
  .then(({body : {msg}}) => {
    expect(msg).toBe("Invalid data type in URL.");
  });
})
  
})

describe("7) PATCH /api/articles/:article_id", () => {
  it("Responds with 200 status code and the updated article; increases the number of votes on the correct article and by the specified number.", () => {
    return request(app)
    .patch('/api/articles/7')
    .send({ inc_votes: 23 })
    .expect(200)
    .then(({body: {article}}) => {
      expect(article).toEqual(
        expect.objectContaining({
          article_id: 7,
          votes: 23,
          author: expect.any(String),
          title: expect.any(String),
          topic:expect.any(String),
          created_at: expect.any(String)
        })
      )
    });
  })
  
  it("Responds with 200 status code and the updated article; decreases the number of votes on the correct article and by the specified number.", () => {
    return request(app)
    .patch('/api/articles/1')
    .send({ inc_votes: -64 })
    .expect(200)
    .then(({body: {article}}) => {
      expect(article.article_id).toBe(1);
      expect(article.votes).toBe(36);
    })
  })
  
  it("Responds with 400 status code if request body contains malformed key.", () => {
    return request(app)
    .patch('/api/articles/10')
    .send({ banana: 12 })
    .expect(400)
    .then(({body: {msg}}) => {
      expect(msg).toBe('Bad request.')
  })
  })
  
  it("Responds with 400 status code if request body contains the wrong data type.", () => {
    return request(app)
    .patch('/api/articles/1')
    .send({ inc_votes: "six" })
    .expect(400)
    .then(({body: {msg}}) => {
      expect(msg).toBe('Invalid data type in URL.')
  })
  })
  
  it("Responds with 404 status code if article_id parameter in the endpoint does not reference an existing article in the database.", () => {
    return request(app)
    .patch('/api/articles/13')
    .send({ inc_votes: 4 })
    .expect(404)
    .then(({body : {msg}}) => {
      expect(msg).toBe('Article not found.');
    })
  })
  
  it("Responds with 400 status code if article_id parameter in the endpoint is invalid (incorrect data type/format)", () => {
    return request(app)
    .patch('/api/articles/user10')
    .send({ inc_votes: 54 })
    .expect(400)
    .then(({body : {msg}}) => {
      expect(msg).toBe('Invalid data type in URL.');
    })
  })
})

describe("8) GET /api/users", () => {
it("Responds with 200 status code and an array of objects, each representing a user.", () => {
  return request(app)
  .get('/api/users')
  .expect(200)
  .then(({body : {users}}) => {
    expect(users).toHaveLength(4);
    users.forEach(user => 
      expect(user).toEqual(
        expect.objectContaining({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String)
        })
    ));
  })
})
})

describe("9) GET /api/articles/:article_id (comment count)", () => {
  it("Responds with 200 status code and an article object which now includes a comment_count property.", () => {
  return request(app)
  .get('/api/articles/1')
  .expect(200)
  .then(({body: {article}}) => {
    expect(article.comment_count).toBe(11);
  
  return request(app)
    .get('/api/articles/3')
    .expect(200)
    .then(({body: {article}}) => {
      expect(article.comment_count).toBe(2)
    });
  })
  })
  })
  