# Welcome to my **_Node.js_ API** backend project 
## December 2022

This repository contains a backend project I have completed which is a CRUD REST API utilising the Express framework on Node.js. This API defines several distinct endpoints which interact with a PSQL database to provide the client with information via different HTTP request methods.

## Quick-start instructions
1) Use https://majids-backend-api-project.onrender.com to send requests to the API.
2) Refer to the endpoints.json file in the root of this repository for information on all available endpoints as well as request body requirements for POST/PATCH request.
   - Alternatively, append /api to the above URL to view all endpoints.

## Running the application

To see this API in action, please follow these steps. For details on sub-directories, see below.

1) Clone the repository into a local directory.
2) In your terminal, execute the command `npm install` to install dependencies.
3) Create environment variables and establish a connection pool to enable PSQL queries - **see below for instructions**.
4) Execute the terminal command ```npm run setup-dbs``` followed by ```npm run seed```. These will create the required databases and seed them with the appropriate data sets.
6) You can now start sending HTTP requests to the API [using this URL](https://majids-backend-api-project.onrender.com). See the endpoints.json file in the root of this repository for information on all available endpoints and request methods.
7) Use ```npm run test``` to run the test suite.

## How to establish a connection to the correct database via environment variables

Within this repository, there are two distinct databases which will be seeded with different data sets. After cloning this repository into a local directory, you will need to create two new text files in the root of the repository to enable you to connect to each database.

1) Create a file named `.env.test` and another file named `.env.development`
2) Inside of the `.env.test` file, type in PGDATABASE=nc_news_test
3) Inside of the `.env.development` file, type in PGDATABASE=nc_news
4) Save all changes and close files

Now that you have defined and saved those two environment variables in your cloned repository, you will be able to establish a succesful connection to the appropriate database depending on the environment you are currently in.

## Summary of important sub-directories in this repository

- **\_\_tests__/** contains test files for this application (testing suite uses Jest and Supertest)
- **controllers/** contains controller functions
- **db/** contains database data, seeding and connection instructions
- **models/** contains model functions that perform queries on the database
- **routes/** contains all the files responsible for routing requests to endpoints