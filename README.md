# How to establish a connection to the correct database via environment variables

Within this repository, there are two distinct databases which will be seeded with different data sets. After cloning this repository into a local directory, you will need to create two new text files in the root of the repository to enable you to connect to each database.

1) Create a file named `.env.test` and another file named `.env.development`
2) Inside of the `.env.test` file, type in PGDATABASE=nc_news_test
3) Inside of the `.env.development` file, type in PGDATABASE=nc_news
4) Save all changes and close files

Now that you have defined and saved those two environment variables in your cloned repository, you will be able to establish a succesful connection to the appropriate database depending on the environment you are currently in.