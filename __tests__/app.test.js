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
it("Responds with 200 status code and an array of article objects sorted by descending date order, each object having a comment_count property with the correct number of comments for that article. Default page length is 10 articles.", () => {
return request(app)
.get('/api/articles')
.expect(200)
.then(({body : {articles}}) => {
  expect(articles).toHaveLength(10);
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
  expect(msg).toBe("Request contains invalid data type.");
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
    expect(comments).toHaveLength(10);
  })
})

it("Returns 404 status code if client makes a request on a path that contains an article_id which does not exist in the database.", () => {
  return request(app)
  .get('/api/articles/44/comments')
  .expect(404)
  .then(({body : {msg}}) => {
     expect(msg).toBe("Resource not found.");
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
    expect(msg).toBe("Request contains invalid data type.");
  })
})

})

describe("6) POST /api/articles/:article_id/comments", () => {
it("Responds with 201 status code, adds new comment to database and sends the newly posted comment in the response.", () => {
  return request(app)
  .post('/api/articles/4/comments')
  .send({username : "lurker", body: "To listen requires a voice, for what needs to be known requires us to ask."})
  .expect(201)
  .then(({body : {comment}}) => {
     expect(comment).toEqual(
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
    expect(msg).toBe("User not found.");
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
    expect(msg).toBe("Request contains invalid data type.");
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
      expect(msg).toBe('Request contains invalid data type.')
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
      expect(msg).toBe('Request contains invalid data type.');
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
  
describe("10) GET /api/articles (queries)", () => {
it("Path includes a query which filters articles by topic, responding with a 200 status code and a filtered list of articles", () => {
return request(app)
.get('/api/articles?topic=mitch')
.expect(200)
.then(({body: {articles}}) => {
  expect(articles).toHaveLength(10);
}).then(()=>{
   return request(app)
   .get('/api/articles?topic=cats')
   .expect(200)
   .then(({body: {articles}}) => {
     expect(articles).toHaveLength(1);
    });
})

})

it("Path includes a query which sorts articles by column, responding with a 200 status code and a sorted list of articles. In the absence of an order query, the default sort order is descending.", () => {
  return request(app)
  .get('/api/articles?sort_by=author')
  .expect(200)
  .then(({body: {articles}}) => {
    expect(articles).toBeSortedBy('author', { descending : true });
  }).then(()=>{
     return request(app)
     .get('/api/articles?sort_by=title')
     .expect(200)
     .then(({body: {articles}}) => {
       expect(articles).toBeSortedBy('title', { descending : true });
      });
  })
})

it("Path includes a query which can order specified columns in ascending order, returning a status code of 200.", () => {
  return request(app)
  .get('/api/articles?sort_by=votes&order=asc')
  .expect(200)
  .then(({body: {articles}}) => {
    expect(articles).toBeSortedBy('votes');
})
})

it("Path can utilise multiple queries at once, returning the correct list of articles", () => {
  return request(app)
  .get('/api/articles?sort_by=title&order=asc&topic=mitch')
  .expect(200)
  .then(({body: {articles}}) => {
    expect(articles).toHaveLength(10);
    expect(articles).toBeSortedBy('title', { ascending : true });
    articles.forEach(article => expect(article.topic).toBe('mitch'));
  })
})

it("Responds with 400 status code if client's request includes a sort_by query for an invalid column.", () => {
  return request(app)
  .get('/api/articles?sort_by=apples')
  .expect(400)
  .then(({ body : { msg }}) => {
    expect(msg).toBe('Invalid sort query.');
  })
})

it("Responds with 400 status code if client's request includes an order query which is invalid (i.e. not 'asc' or 'desc').", () => {
  return request(app)
  .get('/api/articles?order=29')
  .expect(400)
  .then(({ body : { msg }}) => {
    expect(msg).toBe('Invalid order query.');
  })
})

it("Responds with 400 status code if request URL includes query parameters that fail validation.", () => {
  return request(app)
  .get('/api/articles?sort_by=title;%DROP%DATABASE')
  .expect(400)
  .then(({ body : { msg } }) => {
    expect(msg).toBe('Invalid sort query.');
  })
})

it("Responds with 404 status code if client's request includes a topic query for a topic that does not exist in the database", () => {
  return request(app)
  .get('/api/articles?topic=jump')
  .expect(404)
  .then(({ body : { msg }}) => {
    expect(msg).toBe('Resource not found.');
  })
})

it("Responds with 200 status code and an empty array if client's request includes a topic query for a topic that exists in the database but which is not referenced by any of the article objects.", () => {
  return request(app)
  .get('/api/articles?topic=paper')
  .expect(200)
  .then(({ body : { articles }}) => {
    expect(articles).toEqual([]);
  })
})
})

describe.only("11) DELETE /api/comments/:comment_id", () => {
it("Responds with 204 status code and no content, deleting the specified comment from the database.", () => {
return request(app)
.delete('/api/comments/9')
.expect(204)
.then(() => {
  return db.query(`SELECT * FROM comments WHERE comment_id = 9;`)
  .then(({rowCount}) => expect(rowCount).toBe(0));
})
})

it("Responds with 404 status code if specified comment_id does not exist in database.", () => {
  return request(app)
  .delete('/api/comments/344')
  .expect(404)
  .then(({ body : { msg }}) => {
    expect(msg).toBe('Resource not found.');
  })
})

it("Responds with 400 status code if specified comment_id is invalid.", () => {
  return request(app)
  .delete('/api/comments/comment_id12')
  .expect(400)
  .then(({ body : { msg }}) => {
    expect(msg).toBe('Request contains invalid data type.');
  })
})

})

describe("12) GET /api", () => {
it("Responds with 200 status code and returns a JSON string containing all available endpoints.", () => {
  return request(app)
  .get('/api')
  .expect(200)
  .then(({body}) => {
    expect(body["summary of all endpoints available on this API"]).toEqual(
      expect.objectContaining({
        "GET /api": expect.any(Object),
        "GET /api/topics": expect.any(Object),
        "POST /api/topics": expect.any(Object),
        "GET /api/articles": expect.any(Object),
        "POST /api/articles" : expect.any(Object),
        "GET /api/articles/:article_id": expect.any(Object),
        "PATCH /api/articles/:article_id": expect.any(Object),
        "DELETE /api/articles/:article_id": expect.any(Object),
        "GET /api/articles/:article_id/comments": expect.any(Object),
        "POST /api/articles/:article_id/comments": expect.any(Object),
        "GET /api/users": expect.any(Object),
        "GET /api/users/:username": expect.any(Object),
        "PATCH /api/comments/:comment_id": expect.any(Object),
        "DELETE /api/comments/:comment_id": expect.any(Object)
      })
    )
  })
});
})

describe("13) GET /api/users/:username", () => {
it("Responds with 200 status code and a user object with a username, avatar_url and name.", () => {
  return request(app)
  .get('/api/users/rogersop')
  .expect(200)
  .then(({body : {user}}) => {
    expect(user).toEqual(
      expect.objectContaining({
        username: 'rogersop',
        avatar_url: expect.any(String),
        name: 'paul'
      })
    )
  });
})

it("Responds with 404 status code if a request is made with a username which does not exist in the database.", () => {
  return request(app)
  .get('/api/users/123')
  .expect(404)
  .then(({body : { msg }}) => {
    expect(msg).toBe('Username not found.');
  })
})

})

describe("14) PATCH /api/comments/:comment_id", () => {
it("Responds with 201 status code and enables client to update the votes property of a specific comment, returning that comment in the response.", () => {
return request(app)
.patch('/api/comments/4')
.send({inc_votes : 73})
.expect(200)
.then(({ body : {comment}}) => {
  expect(comment).toEqual(
    expect.objectContaining({
      comment_id: 4,
      body: expect.any(String),
      article_id: expect.any(Number),
      author: expect.any(String),
      votes: -27,
      created_at: expect.any(String)
    })
  )
})
})

it("Responds with 404 status code if a request is made with a comment_id which does not exist in the database.", () => {
  return request(app)
  .patch('/api/comments/22')
  .send({inc_votes : -23})
  .expect(404)
  .then(({ body : { msg }}) => {
    expect(msg).toBe("Comment not found.");
  })
})

it("Returns 400 status code if a request is made with a comment_id of the wrong data type.", () => {
  return request(app)
  .patch('/api/comments/comment4')
  .send({inc_votes : -23})
  .expect(400)
  .then(({ body : { msg }}) => {
    expect(msg).toBe("Request contains invalid data type.")
  })
})

it("Returns 400 status code if a request body uses incorrect data type for votes", () => {
  return request(app)
  .patch('/api/comments/7')
  .send({inc_votes : "hello"})
  .expect(400)
  .then(({ body : { msg }}) => {
    expect(msg).toBe("Request contains invalid data type.")
  })
})

it("Returns 400 status code if a request body is malformed.", () => {
  return request(app)
  .patch('/api/comments/7')
  .send({inc_vo : 8})
  .expect(400)
  .then(({ body : { msg }}) => {
    expect(msg).toBe("Bad request.")
  })
})
})

describe("15) POST /api/articles", () => {
it("Returns 201 status code and adds new article to database, responding with the newly added article.", () => {
  const article = {
    author: 'butter_bridge',
    title: 'Cloud spiller sighted',
    body: 'Well, I went down to the water, just to wipe my brow.',
    topic: 'paper'
  }
  return request(app)
  .post('/api/articles')
  .send(article)
  .expect(201)
  .then(({ body : { article }}) => {
    expect(article).toEqual(
      expect.objectContaining({
        article_id: 13,
        title: expect.any(String),
        topic: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        comment_count: expect.any(Number)
      })
    )
  });
})

it("Responds with 400 status code if request body is malformed", () => {
  const article = {
    author: 'butter_bridge',
    title: 'Cloud spiller sighted',
    topic: 'paper'
  }
  return request(app)
  .post('/api/articles')
  .send(article)
  .expect(400)
  .then(({ body : { msg }}) => {
    expect(msg).toBe("Bad request.");
  })
})

it("Responds with 404 status code if author specified in request body does not exist in the database.", () => {
  const article = {
    author: 'junkerson',
    title: 'Cloud spiller sighted',
    body: 'Well, I went down to the water, just to wipe my brow.',
    topic: 'paper'
  }
  return request(app)
  .post('/api/articles')
  .send(article)
  .expect(404)
  .then(({ body : { msg }}) => {
    expect(msg).toBe("User not found.");
  })
})

it("Responds with 404 status code if topic specified in request body does not exist in the database.", () => {
  const article = {
    author: 'butter_bridge',
    title: 'Cloud spiller sighted',
    body: 'Well, I went down to the water, just to wipe my brow.',
    topic: 'plain'
  }
  return request(app)
  .post('/api/articles')
  .send(article)
  .expect(404)
  .then(({ body : { msg }}) => {
    expect(msg).toBe("Resource not found.");
  })
})

})

describe("16) GET api/articles (pagination queries)", () => {
it("Endpoint accepts a limit query, responding with 200 status code and limiting the number of returned articles to the set value.", () => {
  return request(app)
  .get('/api/articles?limit=7&sort_by=article_id&order=asc')
  .expect(200)
  .then(({ body : { articles }}) => {
    expect(articles).toHaveLength(7);
    expect(articles.map(obj => obj.article_id)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  })
})

it("Response returns an object which also has a total_count property, displaying the total number of returned articles (this defaults to 10 - see test section 3).", () => {
  return request(app)
  .get('/api/articles?limit=8')
  .expect(200)
  .then(({ body : { articles, total_count }}) => {
    expect(articles).toHaveLength(8);
    expect(total_count).toBe(8);
  })
})

it("Endpoint accepts a page query, which specifies the set of articles to display for a given request.", () => {
  return request(app)
  .get('/api/articles?limit=3&page=4&sort_by=article_id&order=asc')
  .expect(200)
  .then(({ body : { articles, total_count }}) => {
    expect(articles).toHaveLength(3);
    expect(articles.map(obj => obj.article_id)).toEqual([10, 11, 12]);
    expect(total_count).toBe(3);
  })
})

it("Responds with 200 status code and an empty array if the limit and/or page query exceeds the size of the data set.", () => {
  return request(app)
  .get('/api/articles?limit=6&page=5')
  .expect(200)
  .then(({ body : { articles, total_count }}) => {
    expect(articles).toEqual([]);
    expect(total_count).toBe(0);
  })
})

it("Responds with 400 status code if request contains invalid limit query.", () => {
  return request(app)
  .get('/api/articles?limit=eight')
  .expect(400)
  .then(({ body : { msg }}) => {
    expect(msg).toBe("Request contains invalid data type.");
  })
})

it("Responds with 400 status code if request contains invalid page query.", () => {
  return request(app)
  .get('/api/articles?page=two')
  .expect(400)
  .then(({ body : { msg }}) => {
    expect(msg).toBe("Request contains invalid data type.");
  })
})

})

describe("17) GET /api/articles/:article_id/comments (pagination)", () => {
it("Endpoint accepts a limit query which limits the number of responses up to a set value.", () => {
return request(app)
.get('/api/articles/1/comments?limit=7')
.expect(200)
.then(({ body : { comments }}) => {
  expect(comments).toHaveLength(7);
})
})

it("Responds with 200 status code and an empty array if limit or page query exceed the size of the data set.", () => {
return request(app)
.get('/api/articles/9/comments?limit=3&page=2')
.expect(200)
.then(({ body : { comments }}) => {
  expect(comments).toEqual([]);
})
})

it("Endpoint responds with 10 comments by default (set by default parameter)", () => {
return request(app)
.get('/api/articles/1/comments')
.expect(200)
.then(({ body : { comments }}) => {
  expect(comments).toHaveLength(10);
})
})

it("Endpoint accepts a page query which specifies the page of comments to respond with.", () => {
return request(app)
.get('/api/articles/1/comments?limit=2&page=3')
.expect(200)
.then(({ body : { comments }}) => {
  expect(comments).toHaveLength(2);
  expect(comments.map(obj => obj.comment_id)).toEqual([7, 8])
})
})

it("Responds with 400 status code if limit query contains invalid value.", () => {
return request(app)
.get('/api/articles/1/comments?limit=limit&page=2')
.expect(400)
.then(({body : { msg }}) => {
  expect(msg).toBe("Request contains invalid data type.");
})
})

it("Responds with 400 status code if page query contains invalid value.", () => {
return request(app)
.get('/api/articles/1/comments?limit=2&page=three')
.expect(400)
.then(({body : { msg }}) => {
  expect(msg).toBe("Request contains invalid data type.");
})
})

})

describe("18) POST /api/topics", () => {
it("Responds with 201 status code, adds a new topic to the database and sends back a response with the newly added topic.", () => {
const topic = 
  {
    "slug": "Rainbow",
    "description": "Today will be blue, tomorrow purple, the next day red, and the day after orange."
  };
return request(app)
.post('/api/topics')
.send(topic)
.expect(201)
.then(({body : { topic }}) => {
  expect(topic).toEqual(
    expect.objectContaining({
      slug: expect.any(String),
      description: expect.any(String)
    })
  )
});
})

it("Responds with 201 status code and returns new topic as long as request object does not violate any PSQL table constraints.", () => {
  const topic = 
  {
    "slug": "The secret of existence"
  };
return request(app)
.post('/api/topics')
.send(topic)
.expect(201)
.then(({body : { topic }}) => {
  expect(topic).toEqual(
    expect.objectContaining({
      slug: expect.any(String),
      description: null
    })
  );
})
})

it("Responds with 201 status code and returns the new topic, with any malformed keys replaced with a key-value pair consisting of the correct column name and null", () => {
  const topic = 
  {
    "slug": "Rainbow",
    "descrip": "Not a primary key; no constraints; allowed to be null"
  };
return request(app)
.post('/api/topics')
.send(topic)
.expect(201)
.then(({body : { topic }}) => {
  expect(topic.description).toBe(null);
})
})

it("Responds with 400 status code if request body is missing a required key (leading to primary key not null constraint violation).", () => {
  const topic = 
  {
    "slu": "Alkaline earth metals",
    "description": "Let's discuss potassium."
  };
return request(app)
.post('/api/topics')
.send(topic)
.expect(400)
.then(({body : { msg }}) => {
  expect(msg).toBe("Bad request.");
})
})
})

describe("19) DELETE /api/articles/:article_id", () => {
it("Responds with 204 status code and no content; deletes article from database.", () => {
return request(app)
.delete('/api/articles/8')
.expect(204)
.then(() => db.query('SELECT * FROM articles WHERE article_id = 8;'))
.then(({rowCount}) => expect(rowCount).toBe(0));
})

it("Responds with 404 status code if request includes an article_id which does not exist in the database.", () => {
return request(app)
.delete('/api/articles/13')
.expect(404)
.then(({ body : { msg }}) => {
  expect(msg).toBe("Resource not found.")
});
})

it("Responds with 204 status code and deletes the article AND all of its comments.", () => {
return request(app)
.delete('/api/articles/5')
.expect(204)
.then(() => db.query('SELECT * FROM comments WHERE article_id = 5;'))
.then(({rowCount}) => expect(rowCount).toBe(0));
})

it("Responds with 400 status code if request contains an article_id of invalid data type.", () => {
return request(app)
.delete('/api/articles/article5')
.expect(400)
.then(({ body : { msg }}) => {
  expect(msg).toBe("Request contains invalid data type.");
});
})
})
