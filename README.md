# Welcome to my **_Node.js_ API** backend project

**[Link to hosted API](https://majids-backend-api-project.onrender.com)**;
_created December 2022._

This repository contains a back end project I completed which is a CRUD REST API utilising the Express framework on Node.js. The API operates on data pertaining to articles, comments, topics and users, mimicking the type of data you'd expect to see in a typical online message board.

## Quick-start instructions to see the API in action

1. To access the root endpoint, [use this URL](https://majids-backend-api-project.onrender.com).
2. Append /api to the above URL to view all endpoints, including available queries and request body requirements.

---

## Key product features
- Full CRUD functionality available on a wide range of endpoints.
- Exhaustive, full-coverage integration testing.
- Uses complex SQL join queries, aggregate functions and cascade rules.
- User authentication with password-hashing functions, allowing for signup and login.
- Advanced error handling:
   - customised asynchronous middleware;
   - customised responses for specific SQL constraint violations.
- Programmatic database seeding.
- Architected using MVC pattern.
- Modular routing.
- Pagination through SQL offset and limit clauses.
- CI/CD pipeline configured using GitHub Actions.

---

## Running the testing suite

This application has been tested using the Jest and Supertest libraries. To run the tests for this application in your local development environment, please follow the steps outlined below.

1. Clone the repository into a local directory.
2. In your terminal, run the command `npm install` to install dependencies.
3. Create environment variables to enable you to establish a connection pool - **see below for instructions**.
4. Run the command `npm run setup-dbs` to create a new test database and a new development database.
5. Run the command `npm run seed` to seed the local development database with its corresponding data set.
6. Now that both databases have been created and seeded, you can run the command `npm test` to run the entire test suite (or `npm test app` to run only the integration tests for all endpoints).

### Minimum software versions

- Node.js : v18.11.0
- node-postgres : 8.7.3

---

## How to establish a connection to the required database using environment variables

Within this repository, there are two distinct databases, a test database and a development database. For the purposes of testing, the test database must be seeded with test data.

After cloning this repository into a local directory, you will need to create two new text files (which will be *.gitignore*d) in the root of the repository to ensure that the connection pool connects to the correct database.

1. Create a file named _.env.test_ and another file named _.env.development_
2. Inside of the _.env.test_ file, type in PGDATABASE=nc_news_test
3. Inside of the _.env.development_ file, type in PGDATABASE=nc_news
4. Save all changes and close files.

When you run the test suite, Jest sets NODE_ENV to 'test' and the database will be automatically seeded with test data before each test is carried out.

---

## Appendix 
Summary of important sub-directories in this repository:

- **\_\_tests\_\_/** contains the testing suite for this application.
- **controllers/** contains all controller functions for sending responses.
- **db/** contains database data, seeding function and connection pool.
- **models/** contains model functions that perform queries on the database.
- **routes/** contains all the files responsible for routing requests to endpoints.
