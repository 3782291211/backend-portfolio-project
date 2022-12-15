# Introducing my **Node.js API** backend project

This repository contains a backend project I have completed which is a CRUD REST API utilising the Express framework on Node.js. This API defines several distinct endpoints which interact with a PSQL database to provide the client with information via different HTTP request methods.

# Running the API 

To see this API in action, please follow these steps. 

1) Clone the repository into a local directory.
2) In your terminal, execute the command `npm install`
3) s

## How to establish a connection to the correct database via environment variables

Within this repository, there are two distinct databases which will be seeded with different data sets. After cloning this repository into a local directory, you will need to create two new text files in the root of the repository to enable you to connect to each database.

1) Create a file named `.env.test` and another file named `.env.development`
2) Inside of the `.env.test` file, type in PGDATABASE=nc_news_test
3) Inside of the `.env.development` file, type in PGDATABASE=nc_news
4) Save all changes and close files

Now that you have defined and saved those two environment variables in your cloned repository, you will be able to establish a succesful connection to the appropriate database depending on the environment you are currently in.

## Link to API
https://majids-backend-api-project.onrender.com

## Summary of endpoints
To see all endpoints and request methods available on this API, please see the endpoints.json file in the root of this repository.