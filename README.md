# Welcome to my **_Node.js_ API** backend project
 
__[Link to hosted API](https://majids-backend-api-project.onrender.com)__;
*created on December 2022.*

This repository contains a backend project I have completed which is a CRUD REST API utilising the Express framework on Node.js. 

This API defines several distinct endpoints which interact with a live remote database via PSQL queries to provide the client with information via different HTTP request methods. The relational database contains information on articles, comments, topics and users, mimicking the type of data you'd expect to see in a typical online message board where users can post comments on different articles, which themselves can fall under different topics.

Broadly speaking, the purpose of this API is to allow clients to request information relating to those articles, comments, topics and users, as well as allowing information to be added, updated or deleted via specific endpoints.

## Quick-start instructions to see the API in action
1) To send requests to the API and view responses in JSON format, [use this URL](https://majids-backend-api-project.onrender.com).
2) Refer to the *endpoints.json* file in the root of this repository for information on all available endpoints and request methods as well as request body requirements for POST/PATCH requests.
   - Alternatively, append /api to the above URL to view all endpoints.

### Recommended (minimum) software versions
- Node.js : v18.11.0
- node-postgres : 8.7.3

## Running the testing suite

This application has been tested using the Jest and Supertest libraries. To run the tests for this application, please follow the following steps.

1) Clone the repository into a local directory.
2) In your terminal, run the command `npm install` to install dependencies.
3) Create environment variables to enable you to establish a connection pool queries - **see below for instructions**.
4) Run the command `npm run setup-dbs` to create a new test database and a new development database.
5) Run the command `npm run seed` to seed the local development database with its corresponding data set.
6) Now that both databases have been created and seeded, you can run the command `npm test` to run the entire test suite (testing endpoints plus utility functions). Alternatively, run the command `npm test app` to run only the integration tests for all endpoints and to view all the tests in the terminal.

## How to establish a connection to the required database using environment variables

Within this repository, there are two distinct databases (a test database and a development database) which will be seeded with different data sets depending on the environment. After cloning this repository into a local directory, you will need to create two new text files (which will be *.gitignore*d) in the root of the repository to enable you to connect to each database.

1) Create a file named *.env.test* and another file named *.env.development*
2) Inside of the *.env.test* file, type in PGDATABASE=nc_news_test
3) Inside of the *.env.development* file, type in PGDATABASE=nc_news
4) Save all changes and close files

Now that you have defined and saved those two environment variables in your cloned repository, you will be able to establish a succesful connection to the appropriate database depending on the environment you are currently in. 
- When you run the test suite, the environment is set to 'test' and the database will be automatically seeded with test data before each test is carried out.
- If you are not running tests but would instead like to re-create and re-seed the development database from scratch, refer to steps 4 and 5 from the previous section.

## Summary of important sub-directories in this repository

- **\_\_tests__/** contains the testing suite for this application.
- **controllers/** contains all controller functions for sending responses.
- **db/** contains database data, seeding function and connection pool.
- **models/** contains model functions that perform queries on the database
- **routes/** contains all the files responsible for routing requests to endpoints