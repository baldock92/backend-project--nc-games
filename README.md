# Northcoders House of Games API

## Background

I will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

The database will be PSQL, and I will interact with it using node-postgres.

## Files to be added:

Anybody looking to clone this project and run it locally must add a .env file for both the development and test database, and assigning the PGDATABASE to the respective database.
You can do this by setting up 2 files, .env.development & .env.test 
Inside the respective file, add PGDATABASE=nc_games or PGDATABASE=nc_games_test


